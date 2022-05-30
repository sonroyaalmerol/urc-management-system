import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'
import slugGenerator from '../../../../lib/slugGenerator'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { FileUpload, Project, ResearchPresentation, VerificationRequest } from '@prisma/client'

import relevancy from 'relevancy'
import roleChecker from '../../../../lib/roleChecker'
import parseBodyWithFile from '../../../../lib/server/parseBodyWithFile'
import cleanString from '../../../../lib/cleanString'
import handleError from '../../../../lib/server/handleError'

export const config = {
  api: {
    bodyParser: false
  }
}

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const searchQuery = (req.query?.query as string) ?? ''

  const queryFilter = searchQuery.split(' ').filter(s => s.trim().length > 0)
  const queryFields = [
    'title'
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

  const whereQuery = searchQuery.trim().length > 0 ? {
    OR: orQuery
  } : undefined

  let [totalCount, data] = await prisma.$transaction([
    prisma.researchPresentation.count({
      where: {
        title: {
          not: ''
        },
        ...whereQuery
      }
    }),
    prisma.researchPresentation.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        title: {
          not: ''
        },
        ...whereQuery
      },
      select: {
        id: true,
        title: true
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
  const body: { files: {
    fieldName: string,
    value: FileUpload
  }[], fields: Partial<
    ResearchPresentation & VerificationRequest
  > } = await parseBodyWithFile(req, { publicAccess: false })

  if (!cleanString(body.fields.title)) {
    return res.status(400).json({ error: 'Title is required!' })
  }

  if (!cleanString(body.fields.role)) {
    return res.status(400).json({ error: 'Role is required!' })
  }

  let currentEntry = await prisma.researchPresentation.findUnique({
    where: {
      title: body.fields.title
    }
  })

  if (!currentEntry) {
    if (!cleanString(body.fields.location)) {
      return res.status(400).json({ error: 'Location is required!' })
    }

    if (!cleanString(body.fields.event_date)) {
      return res.status(400).json({ error: 'Event Date is required!' })
    }

    if (!cleanString(body.fields.conference)) {
      return res.status(400).json({ error: 'Conference is required!' })
    }

    currentEntry = await prisma.researchPresentation.create({
      data: {
        title: body.fields.title,
        location: body.fields.location,
        event_date: body.fields.event_date,
        conference: body.fields.conference,
        url: body.fields.url
      }
    })
  }

  const verificationRequest = await prisma.verificationRequest.create({
    data: {
      profile: {
        connect: {
          id: session.profile.id
        }
      },
      role: body.fields.role,
      type: 'RESEARCH_PRESENTATION',
      description: body.fields.description,
      research_presentation: {
        connect: {
          id: currentEntry.id
        }
      },
      proof_uploads: {
        connect: body.files?.map(f => ({ id: f.value.id })) || []
      }
    }
  })

  return res.status(200).json({ success: true, data: verificationRequest })
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
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}