import { prisma } from '../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import handleError from '../../../lib/server/handleError'

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