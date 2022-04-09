import prisma from "../../../../lib/prisma-client"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  const publications = await prisma.bookPublication.findFirst({
    where: {
      id: id as string
    },
    include: {
      bridge_users: {
        include: {
          user: true
        }
      }
    },
  })

  if (publications) {
    res.status(200).json(publications)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}