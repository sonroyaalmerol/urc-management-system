import { prisma } from "../../../../lib/server/prisma"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { short_name } = req.query

  const institute = await prisma.institute.findFirst({
    where: {
      short_name: short_name as string
    },
    include: {
      bridge_users: {
        include: {
          user: true
        }
      }
    }
  })

  if (institute) {
    res.status(200).json(institute)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}