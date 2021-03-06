import { prisma } from '../../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import handleError from '../../../../../utils/server/handleError'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id } = req.query

  const [totalCount, data] = await prisma.$transaction([
    prisma.institute.count({
      where: {
        bridge_projects: {
          some: {
            project: {
              id: id as string
            }
          }
        }
      }
    }),
    prisma.institute.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        bridge_projects: {
          some: {
            project: {
              id: id as string
            }
          }
        }
      },
    })
  ])

  return res.status(200).json({
    totalCount,
    data
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  return await handleError(async () => {
    if (req.method === 'GET') {
      return await getHandler(req, res, session)
    }
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}