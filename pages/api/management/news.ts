import { prisma } from '../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  let instituteChecker = session.profile.bridge_institutes.map((institute) => {
    return {
      institute_id: institute.institute_id
    }
  })

  let instituteId = null

  if (req.query.institute) {
    instituteChecker = []

    const institute = await prisma.institute.findUnique({
      where: {
        id: req.query.institute as string
      }
    })

    if (institute.short_name !== 'URC') {
      instituteId = req.query.institute
    }
  }

  const [totalCount, data] = await prisma.$transaction([
    prisma.instituteNews.count({
      where: {
        OR: [
          {
            institute_id: instituteId
          },
          ...instituteChecker
        ]
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
          {
            institute_id: instituteId
          },
          ...instituteChecker
        ]
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
        updated_at: 'desc'
      }
    })
  ])

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {

}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  if (req.method === 'POST') {
    return await postHandler(req, res, session);
  }

  if (req.method === 'GET') {
    return await getHandler(req, res, session)
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}