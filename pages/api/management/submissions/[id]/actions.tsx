import { prisma } from '../../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { UserRole } from '@prisma/client'

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<UserRole>

  const { id } = req.query


  return res.status(200).json({ success: true })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as { approved: boolean }
  const { id } = req.query

  /* 
  const submission = await prisma.submission.findUnique({
    where: {
      id: id as string
    },
    include: {
      project: true,
      budget_proposal_submission: true,
      capsule_proposal_submission: true,
      deliverable_submission: true,
      full_blown_proposal_submission: true
    }
  })
  switch (submission.type) {
    case 'BUDGET':
      break
    case 'CAPSULE':

      break
    case 'DELIVERABLE':

      break
    case 'FULL':

      break
  }
  */

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
    }
  })

  return res.status(200).json({ success: true, data: submission })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  if (req.method === 'POST') {
    return await postHandler(req, res, session);
  }

  if (req.method === 'DELETE') {
    return await deleteHandler(req, res, session)
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}