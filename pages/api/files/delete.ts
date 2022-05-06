import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/server/prisma'
import { deleteFile } from '../../../lib/server/drive'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id } = JSON.parse(req.body)

    const file = await prisma.fileUpload.findFirst({
      where: {
        id: id as string
      }
    })
    if (!file) {
      return res.status(404).json({ error: 'File not found!' })
    }

    const session = await getSession({ req })
    if (!session) {
      return res.status(401).json({ error: 'Authentication required.' })
    }

    try {
      const deleted = await deleteFile(id)

      return res.status(200).json(deleted)
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else {
    // Handle any other HTTP method
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}