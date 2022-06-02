import { prisma } from '../../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { UserRole } from '@prisma/client'
import handleError from '../../../../../lib/server/handleError'
import { roleChecker } from '../../../../../lib/roleChecker'

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_staff', 'urc_board_members'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<UserRole>

  const { id } = req.query

  await prisma.profile.update({
    where: {
      id: id as string
    },
    data: {
      roles: {
        disconnect: {
          id: body.id
        }
      }
    }
  })

  return res.status(200).json({ success: true })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_staff'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<UserRole>

  const { id } = req.query

  const profile = await prisma.profile.findUnique({
    where: {
      id: id as string
    },
    include: {
      roles: true
    }
  })

  if (body.id !== 'researcher' && profile.roles.filter((role) => role.id !== 'researcher').length > 0) {
    return res.status(400).json({ error: `A role conflict has been detected!` })
  }

  await prisma.profile.update({
    where: {
      id: id as string
    },
    data: {
      roles: {
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