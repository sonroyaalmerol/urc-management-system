import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import handleError from '../../../../lib/server/handleError'
import { DownloadCategory } from '@prisma/client'
import cleanString from '../../../../lib/cleanString'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  let [totalCount, data] = await prisma.$transaction([
    prisma.downloadCategory.count(),
    prisma.downloadCategory.findMany()
  ])

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<DownloadCategory>

  if (!cleanString(body.title)) {
    return res.status(400).json({ error: 'Name is required!' })
  }

  let category: DownloadCategory

  if (body.id) {
    category = await prisma.downloadCategory.update({
      where: {
        id: body.id
      },
      data: {
        title: body.title,
      }
    })
  } else {
    category = await prisma.downloadCategory.create({
      data: {
        title: body.title,
        description: body.description
      }
    })
  }

  return res.status(200).json({ success: true, data: category })
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<DownloadCategory>

  if (!cleanString(body.id)) {
    return res.status(400).json({ error: 'DownloadCategory is required!' })
  }

  const category = await prisma.downloadCategory.delete({
    where: {
      id: body.id
    }
  })

  return res.status(200).json({ success: true, data: category })
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