import { prisma } from '../../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Unit } from '@prisma/client'
import handleError from '../../../../../lib/server/handleError'
import { roleChecker } from '../../../../../lib/roleChecker'

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_staff', 'urc_board_members'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<Unit>

  const { id } = req.query

  await prisma.profile.update({
    where: {
      id: id as string
    },
    data: {
      units: {
        disconnect: {
          id: body.id
        }
      }
    }
  })

  return res.status(200).json({ success: true })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_staff', 'urc_board_members'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<Unit>

  const { id } = req.query

  await prisma.profile.update({
    where: {
      id: id as string
    },
    data: {
      units: {
        connect: {
          id: body.id
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