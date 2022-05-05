import { prisma } from "../../../../lib/prisma-client"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  
  const unit = await prisma.unit.findFirst({
    where: {
      id: id as string
    },
    include: {
      parent_unit: true,
      sub_units: true
    }
  })

  if (unit) {
    res.status(200).json(unit)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}