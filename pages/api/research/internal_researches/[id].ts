import { prisma } from "../../../../lib/server/prisma"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  const research = await prisma.uRCFundedResearch.findFirst({ 
    where: {
      id: id as string,
      approved: true
    },
    include: {
      units: {
        include: {
          parent_unit: true
        }
      },
      bridge_users: {
        include: {
          user: true
        }
      }
    } 
  })

  if (research) {
    return res.status(200).json(research)
  } else {
    return res.status(404).json({ error: 'Resource not found.' })
  }
}