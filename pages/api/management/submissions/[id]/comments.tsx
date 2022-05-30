import { prisma } from '../../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Comment, UserRole } from '@prisma/client'
import cleanString from '../../../../../lib/cleanString'

import handleError from '../../../../../lib/server/handleError'

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<Comment>

  const { id } = req.query


  return res.status(200).json({ success: true })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<Comment>

  const { id } = req.query

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