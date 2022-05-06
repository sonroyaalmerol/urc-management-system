import { prisma } from "../../../../lib/server/prisma"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  const researcher = await prisma.user.findFirst({
    where: {
      id: id as string,
      roles: {
        some: {
          id: 'researcher'
        }
      }
    }
  })

  if (researcher) {
    return res.status(200).json(researcher)
  } else {
    return res.status(404).json({ error: 'Resource not found.' })
  }
}