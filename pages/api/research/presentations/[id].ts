import { prisma } from "../../../../lib/server/prisma"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  const presentations = await prisma.researchPresentation.findFirst({
    where: {
      id: id as string,
      verified: true
    },
    include: {
      bridge_users: {
        include: {
          user: true
        }
      },
      units: {
        include: {
          parent_unit: true
        }
      }
    },
  })

  if (presentations) {
    return res.status(200).json(presentations)
  } else {
    return res.status(404).json({ error: 'Resource not found.' })
  }
}