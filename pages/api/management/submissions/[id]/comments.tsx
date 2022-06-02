import { prisma } from '../../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Comment, UserRole } from '@prisma/client'
import cleanString from '../../../../../utils/cleanString'

import handleError from '../../../../../utils/server/handleError'
import { memberChecker, roleChecker } from '../../../../../utils/roleChecker'
import { MANAGING_DELIVERABLES, REVIEW_PROPOSALS } from '../../../../../utils/permissions'

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<Comment>

  const { id } = req.query


  return res.status(200).json({ success: true })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id } = req.query

  const submission = await prisma.submission.findUnique({
    where: {
      id: id as string
    },
    include: {
      project: {
        include: {
          bridge_profiles: true
        }
      }
    }
  })

  if (submission.type === 'DELIVERABLE') {
    if (!roleChecker(session.profile, MANAGING_DELIVERABLES) && !memberChecker(session.profile, submission.project.bridge_profiles)) {
      return res.status(401).json({ error: 'Unauthorized access.' })
    }
  } else {
    if (!roleChecker(session.profile, REVIEW_PROPOSALS) && !memberChecker(session.profile, submission.project.bridge_profiles)) {
      return res.status(401).json({ error: 'Unauthorized access.' })
    }
  }
  
  const body = JSON.parse(req.body) as Partial<Comment>

  if (!cleanString(body.content)) {
    return res.status(400).json({ error: 'Content is required!' })
  }

  const comment = await prisma.comment.create({
    data: {
      submission: {
        connect: {
          id: id as string
        }
      },
      content: body.content as string,
      profile: {
        connect: {
          id: session.profile.id
        }
      }
    },
    include: {
      profile: true
    }
  })

  return res.status(200).json({ success: true, data: comment })
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