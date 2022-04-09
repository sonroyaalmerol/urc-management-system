import prisma from "../../../../lib/prisma-client"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  const disseminations = await prisma.researchDissemination.findFirst({
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

  if (disseminations) {
    res.status(200).json(disseminations)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}