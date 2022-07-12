import { prisma } from '../../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import handleError from '../../../../../utils/server/handleError'
import { ResearchThrust, UniversityMission } from '@prisma/client'
import cleanString from '../../../../../utils/cleanString'
import { roleChecker } from '../../../../../utils/roleChecker'
import { SETTING_UNITS } from '../../../../../utils/permissions'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id } = req.query

  let [totalCount, data] = await prisma.$transaction([
    prisma.researchThrust.count({
      where: {
        university_mission: {
          id: id as string
        }
      }
    }),
    prisma.researchThrust.findMany({
      where: {
        university_mission: {
          id: id as string
        }
      },
      orderBy: {
        description: 'asc'
      }
    })
  ])

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id } = req.query

  if (!roleChecker(session.profile, SETTING_UNITS)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<UniversityMission>

  if (!cleanString(body.description)) {
    return res.status(400).json({ error: 'Description is required!' })
  }

  let researchThrust: ResearchThrust

  if (body.id) {
    researchThrust = await prisma.researchThrust.update({
      where: {
        id: body.id
      },
      data: {
        description: body.description,
        university_mission: {
          connect: {
            id: id as string
          }
        }
      }
    })
  } else {
    researchThrust = await prisma.researchThrust.create({
      data: {
        description: body.description,
        university_mission: {
          connect: {
            id: id as string
          }
        }
      }
    })
  }

  return res.status(200).json({ success: true, data: researchThrust })
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, SETTING_UNITS)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<ResearchThrust>

  if (!cleanString(body.id)) {
    return res.status(400).json({ error: 'Research Thrust is required!' })
  }

  const researchThrust = await prisma.researchThrust.delete({
    where: {
      id: body.id
    }
  })

  return res.status(200).json({ success: true, data: researchThrust })
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