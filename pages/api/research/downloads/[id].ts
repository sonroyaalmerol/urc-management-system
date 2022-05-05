import { prisma } from "../../../../lib/server/prisma"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  const download = await prisma.download.findFirst({ 
    where: {
      id: id as string
    }
  })

  if (download) {
    res.status(200).json(download)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}