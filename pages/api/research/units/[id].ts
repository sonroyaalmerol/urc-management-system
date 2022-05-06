import { prisma } from "../../../../lib/server/prisma"

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
    return res.status(200).json(unit)
  } else {
    return res.status(404).json({ error: 'Resource not found.' })
  }
}