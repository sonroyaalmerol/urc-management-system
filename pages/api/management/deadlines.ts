import { prisma } from '../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import handleError from '../../../utils/server/handleError'
import cleanString from '../../../utils/cleanString'
import { Deadline } from '@prisma/client'
import handleDate from '../../../utils/server/handleDate'
import { roleChecker } from '../../../utils/roleChecker'
import { SETTING_DEADLINES } from '../../../utils/permissions'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const [totalCount, data] = await prisma.$transaction([
    prisma.deadline.count({
      where: {
        date: {
          gte: new Date()
        }
      },
    }),
    prisma.deadline.findMany({
      where: {
        date: {
          gte: new Date()
        }
      },
      orderBy: {
        date: 'asc'
      }
    })
  ])

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, SETTING_DEADLINES)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<Deadline>

  if (!cleanString(body.title)) {
    return res.status(400).json({ error: 'Title is required!' })
  }

  if (!body.date) {
    return res.status(400).json({ error: 'Date is required!' })
  }

  let deadline: Deadline

  if (body.id) {
    deadline = await prisma.deadline.update({
      where: {
        id: body.id
      },
      data: {
        title: body.title,
        date: handleDate(body.date)
      }
    })
  } else {
    deadline = await prisma.deadline.create({
      data: {
        title: body.title,
        date: handleDate(body.date)
      }
    })
  }

  return res.status(200).json({ success: true, data: deadline })
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, SETTING_DEADLINES)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<Deadline>

  if (!cleanString(body.id)) {
    return res.status(400).json({ error: 'Deadline is required!' })
  }

  const unit = await prisma.deadline.delete({
    where: {
      id: body.id
    }
  })

  return res.status(200).json({ success: true, data: unit })
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