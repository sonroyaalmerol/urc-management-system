import { prisma } from "../../../../lib/server/prisma"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  const disseminations = await prisma.researchDissemination.findFirst({
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

  if (disseminations) {
    res.status(200).json(disseminations)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}