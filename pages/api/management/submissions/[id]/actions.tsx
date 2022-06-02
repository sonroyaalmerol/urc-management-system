import { prisma } from '../../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { UserRole } from '@prisma/client'

import handleError from '../../../../../lib/server/handleError'
import { roleChecker } from '../../../../../lib/roleChecker'

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<UserRole>

  const { id } = req.query


  return res.status(200).json({ success: true })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_board_member'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as { approved: boolean }
  const { id } = req.query

  const submission = await prisma.submission.update({
    where: {
      id: id as string
    },
    data: {
      status: body.approved ? 'APPROVED' : 'NOT_APPROVED',
      processed_by: {
        connect: {
          id: session.profile.id
        }
      }
    },
    include: {
      deliverable_submission: {
        include: {
          deliverable: true
        }
      }
    }
  })

  if (submission.type === 'DELIVERABLE') {
    await prisma.deliverable.update({
      where: {
        id: submission.deliverable_submission.deliverable.id
      },
      data: {
        done: body.approved
      }
    })
  }

  return res.status(200).json({ success: true, data: submission })
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