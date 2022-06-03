import { prisma } from '../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import handleError from '../../../utils/server/handleError'
import { InstituteNews } from '@prisma/client'
import cleanString from '../../../utils/cleanString'
import handleDate from '../../../utils/server/handleDate'
import slugGenerator from '../../../utils/slugGenerator'
import { deleteFile } from '../../../utils/server/file'
import { roleChecker } from '../../../utils/roleChecker'
import { VERIFY_CENTER_NEWS } from '../../../utils/permissions'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  let instituteChecker

  if (req.query.institute) {
    instituteChecker = [{
      institute: {
        id: req.query.institute
      }
    }]
  } else {
    instituteChecker = session.profile.bridge_institutes.map<any>((institute) => {
      return {
        institute_id: institute.institute_id
      }
    })
    instituteChecker.push({
      institute: {
        short_name: 'URC'
      }
    })
  }

  const [totalCount, data] = await prisma.$transaction([
    prisma.instituteNews.count({
      where: {
        OR: [
          ...instituteChecker
        ],
        verified: true
      }
    }),
    prisma.instituteNews.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        OR: [
          ...instituteChecker
        ],
        verified: true
      },
      include: {
        uploads: true,
        profile: {
          include: {
            user: true
          }
        },
        institute: true,
      },
      orderBy: {
        created_at: 'desc'
      }
    })
  ])

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, VERIFY_CENTER_NEWS)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<InstituteNews>

  if (!body.id) {
    return res.status(400).json({ error: 'News is required!' })
  }

  if (!cleanString(body.title)) {
    return res.status(400).json({ error: 'Title is required!' })
  }

  if (!cleanString(body.content)) {
    return res.status(400).json({ error: 'Content is required!' })
  }

  if (!cleanString(body.created_at as any)) {
    return res.status(400).json({ error: 'Date is required!' })
  }

  const news = await prisma.instituteNews.update({
    where: {
      id: body.id
    },
    data: {
      title: body.title,
      content: body.content,
      created_at: handleDate(body.created_at),
      slug: slugGenerator(body.title)
    },
    include: {
      uploads: true,
      profile: {
        include: {
          user: true
        }
      },
      institute: true
    }
  })

  return res.status(200).json({ success: true, data: news })
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, VERIFY_CENTER_NEWS)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<InstituteNews>

  if (!cleanString(body.id)) {
    return res.status(400).json({ error: 'News is required!' })
  }

  const news = await prisma.instituteNews.delete({
    where: {
      id: body.id
    },
    include: {
      uploads: true
    }
  })

  for await (const file of news.uploads) {
    await deleteFile(file.id)
  }

  return res.status(200).json({ success: true, data: news })
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