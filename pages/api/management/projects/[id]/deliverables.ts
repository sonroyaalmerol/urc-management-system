import { prisma } from '../../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import type { Deliverable } from '@prisma/client'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id } = req.query

  const [totalCount, data] = await prisma.$transaction([
    prisma.deliverable.count({
      where: {
        project_id: id as string,
        done: false
      }
    }),
    prisma.deliverable.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        project_id: id as string,
        done: false
      },
      orderBy: {
        deadline: 'asc'
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
  const body = JSON.parse(req.body) as Deliverable

  if (!body.title) {
    return res.status(400).json({ error: 'Title is required!' })
  }

  if (!body.description) {
    return res.status(400).json({ error: 'Description is required!' })
  }

  if (!body.deadline) {
    return res.status(400).json({ error: 'Deadline is required!' })
  }

  const deliverable = await prisma.deliverable.create({
    data: {
      title: body.title,
      description: body.description,
      deadline: body.deadline,
      project: {
        connect: {
          slug: id as string
        }
      }
    }
  })
  
  return res.status(200).json({ success: true, data: deliverable })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  if (req.method === 'POST') {
    return await postHandler(req, res, session);
  }

  if (req.method === 'GET') {
    return await getHandler(req, res, session)
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}