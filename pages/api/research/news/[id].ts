import { prisma } from "../../../../lib/server/prisma"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  const news = await prisma.instituteNews.findFirst({
    where: {
      id: id as string
    },
    include: {
      uploads: true
    }
  })

  if (news) {
    res.status(200).json(news)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}