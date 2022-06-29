import { prisma } from '../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import handleError from '../../../../utils/server/handleError'
import cleanString from '../../../../utils/cleanString'
import { Deadline, Download, FileUpload } from '@prisma/client'
import parseBodyWithFile from '../../../../utils/server/parseBodyWithFile'
import { deleteFile } from '../../../../utils/server/file'

import relevancy from 'relevancy'
import { roleChecker } from '../../../../utils/roleChecker'
import { SETTING_DEADLINES, SETTING_DOWNLOADS } from '../../../../utils/permissions'

export const config = {
  api: {
    bodyParser: false
  }
}

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { category } = req.query

  const searchQuery = (req.query?.query as string) ?? ''

  const queryFilter = searchQuery.split(' ').filter(s => s.trim().length > 0)
  const queryFields = [
    'title', 'description'
  ]
  let orQuery = []
  queryFields.forEach((field) => {
    orQuery = [...orQuery ,...queryFilter.map((word) => ({
      [field]: {
        contains: word,
        mode: 'insensitive'
      }
    }))]
  })

  let whereQuery: any = searchQuery.trim().length > 0 ? {
    OR: orQuery
  } : undefined

  let [totalCount, data] = await prisma.$transaction([
    prisma.download.count({
      where: {
        category: category ? {
          id: category as string
        } : undefined,
        ...whereQuery
      }
    }),
    prisma.download.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        category: category ? {
          id: category as string
        } : undefined,
        ...whereQuery
      },
      include: {
        category: true
      },
      orderBy: {
        updated_at: 'desc'
      }
    })
  ])

  if (searchQuery.trim().length > 0) {
    const fullSearchQuery = queryFilter.join(' ')
    const entryWeights = data.map((entry) => {
      return queryFields.reduce((sum, curr) => {
        if (typeof entry[curr] === 'string' || entry[curr] instanceof String) {
          return relevancy.weight(fullSearchQuery, entry[curr]) + sum
        }
        return sum
      }, 0)
    })
    data = data.map((o, i) => ({ idx: i, obj: o }))
      .sort((a, b) => entryWeights[b.idx] - entryWeights[a.idx])
      .map((x) => x.obj)
  }

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, SETTING_DOWNLOADS)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body: { files: {
    fieldName: string,
    value: FileUpload
  }[], fields: Partial<
    Download & { category_id: string }
  > } = await parseBodyWithFile(req, { publicAccess: true })

  if (!cleanString(body.fields.title) && !body.fields.category_id) {
    return res.status(400).json({ error: 'Title is required!' })
  }

  let download: Download

  if (cleanString(body.fields.id)) {
    download = await prisma.download.update({
      where: {
        id: body.fields.id
      },
      data: {
        title: body.fields.title,
        description: body.fields.description,
        category: cleanString(body.fields.category_id) ? {
          connect: {
            id: body.fields.category_id
          }
        } : undefined
      }
    })
  } else {
    if (body.files.length < 1) {
      return res.status(400).json({ error: 'File is required!' })
    }

    download = await prisma.download.create({
      data: {
        title: body.fields.title,
        description: body.fields.description,
        file_upload: {
          connect: {
            id: body.files[0].value.id
          }
        },
        profile: {
          connect: {
            id: session.profile.id
          }
        },
        category: cleanString(body.fields.category_id) ? {
          connect: {
            id: body.fields.category_id
          }
        } : undefined
      }
    })
  }

  return res.status(200).json({ success: true, data: download })
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, SETTING_DOWNLOADS)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }
  
  const body: { files: {
    fieldName: string,
    value: FileUpload
  }[], fields: Partial<
    Download & { category_id: string }
  > } = await parseBodyWithFile(req, { publicAccess: true })

  if (!cleanString(body.fields.id)) {
    return res.status(400).json({ error: 'Download is required!' })
  }

  const unit = await prisma.download.delete({
    where: {
      id: body.fields.id
    }
  })

  await deleteFile(unit.upload_id)

  return res.status(200).json({ success: true, data: unit })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  return await handleError(async () => {
    if (req.method === 'POST') {
      return await postHandler(req, res, session);
    }
  
    if (req.method === 'GET') {
      return await getHandler(req, res, session)
    }

    if (req.method === 'DELETE') {
      return await deleteHandler(req, res, session)
    }
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}