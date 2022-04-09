import prisma from "../../../../lib/prisma-client"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  const researcher = await prisma.user.findFirst({
    where: {
      id: id as string,
      bridge_roles: {
        some: {
          user_role: {
            id: 'researcher'
          }
        }
      }
    }
  })

  if (researcher) {
    res.status(200).json(researcher)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}