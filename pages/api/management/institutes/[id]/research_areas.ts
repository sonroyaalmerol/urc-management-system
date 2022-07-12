import { prisma } from '../../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { ResearchArea, Unit } from '@prisma/client'
import handleError from '../../../../../utils/server/handleError'
import { memberChecker, roleChecker } from '../../../../../utils/roleChecker'
import { CHANGE_PROJECT_STATUS, UPDATE_CENTER_INFO } from '../../../../../utils/permissions'


const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<ResearchArea>

  const { id } = req.query

  if (!roleChecker(session.profile, UPDATE_CENTER_INFO)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  await prisma.institute.update({
    where: {
      id: id as string
    },
    data: {
      research_areas: {
        disconnect: {
          id: body.id
        }
      }
    }
  })

  return res.status(200).json({ success: true })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<ResearchArea>

  const { id } = req.query

  if (!roleChecker(session.profile, UPDATE_CENTER_INFO)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  await prisma.institute.update({
    where: {
      id: id as string
    },
    data: {
      research_areas: {
        connectOrCreate: {
          where: {
            field: body.field
          },
          create: {
            field: body.field
          }
        }
      }
    }
  })

  return res.status(200).json({ success: true })
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
  
    if (req.method === 'DELETE') {
      return await deleteHandler(req, res, session)
    }
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}