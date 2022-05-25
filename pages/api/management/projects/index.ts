import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Project } from '@prisma/client'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const searchQuery = (req.query?.query as string) ?? ''
  const whereQuery = searchQuery.trim().length > 0 ? {
    OR: [
      {
        title: {
          search: searchQuery.split(' ').filter(s => s.trim().length > 0).join(' & ')
        }
      },
      {
        keywords: {
          has: searchQuery
        }
      },
      {
        abstract: {
          search: searchQuery.split(' ').filter(s => s.trim().length > 0).join(' & ')
        }
      }
    ]
  } : undefined

  const [totalCount, data] = await prisma.$transaction([
    prisma.project.count({
      where: {
        /* bridge_users: {
          some: {
            user_id: session.user.id
          }
        }, //*/
        ...whereQuery
      }
    }),
    prisma.project.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        /* bridge_users: {
          some: {
            user_id: session.user.id
          }
        }, //*/
        ...whereQuery
      },
      include: {
        bridge_profiles: {
          include: {
            profile: {
              include: {
                user: true
              }
            }
          }
        }
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
  const body = JSON.parse(req.body) as Partial<Project>
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