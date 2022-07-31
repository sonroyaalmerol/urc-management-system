import { prisma } from '../../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Profile, ResearchEvent } from '@prisma/client'
import handleError from '../../../../../utils/server/handleError'
import { roleChecker } from '../../../../../utils/roleChecker'
import { MODIFY_RESEARCHER_PROFILE } from '../../../../../utils/permissions'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const searchQuery = (req.query?.query as string) ?? ''

  const queryFilter = searchQuery.split(' ').filter(s => s.trim().length > 0)
  const queryFields = [
    'event_name'
  ]
  let orQuery = []
  queryFields.forEach((field) => {
    orQuery = [...orQuery ,...queryFilter.map((word) => ({
      [field]: {
        contains: word
      }
    }))]
  })

  const whereQuery = searchQuery.trim().length > 0 ? {
    OR: orQuery
  } : undefined

  let [totalCount, data] = await prisma.$transaction([
    prisma.researchEvent.count({
      where: {
        ...whereQuery,
        bridge_profiles: {
          some: {
            profile_id: req.query.id as string
          }
        }
      }
    }),
    prisma.researchEvent.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 4,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        ...whereQuery,
        bridge_profiles: {
          some: {
            profile_id: req.query.id as string
          }
        }
      },
      include: {
        file_uploads: true,
        bridge_profiles: {
          include: {
            profile: {
              include: {
                user: true
              }
            }
          }
        },
      },
      orderBy: [
        {
          event_name: 'asc'
        },
        {
          updated_at: 'desc'
        }
      ]
    })
  ])

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<ResearchEvent>

  if (!roleChecker(session.profile, MODIFY_RESEARCHER_PROFILE)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  await prisma.$transaction([
    prisma.profileToResearchEventBridge.deleteMany({
      where: {
        research_event: {
          id: body.id
        }
      }
    }),
    prisma.verificationRequest.deleteMany({
      where: {
        research_event: {
          id: body.id
        }
      }
    }),
    prisma.researchEvent.delete({
      where: {
        id: body.id
      }
    })
  ])

  return res.status(200).json({
    success: true
  })
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<ResearchEvent>
  const id: string = req.query.id as string

  if (!roleChecker(session.profile, MODIFY_RESEARCHER_PROFILE)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  await prisma.$transaction([
    prisma.profileToResearchEventBridge.deleteMany({
      where: {
        profile: {
          id
        },
        research_event: {
          id: body.id
        }
      }
    }),
    prisma.verificationRequest.deleteMany({
      where: {
        profile: {
          id
        },
        research_event: {
          id: body.id
        }
      }
    })
  ])

  return res.status(200).json({
    success: true
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  return await handleError(async () => {
    if (req.method === 'DELETE') {
      return await deleteHandler(req, res, session);
    }

    if (req.method === 'POST') {
      return await postHandler(req, res, session)
    }
  
    if (req.method === 'GET') {
      return await getHandler(req, res, session)
    }
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}