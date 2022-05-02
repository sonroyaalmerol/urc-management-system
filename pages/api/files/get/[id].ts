import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import prisma from '../../../../lib/prisma-client'
import { getFileDirectImage } from '../../../../lib/drive-client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  const file = await prisma.fileUpload.findFirst({
    where: {
      id: id as string
    }
  })
  if (!file) {
    res.status(404).json({ error: 'File not found!' })
  }

  const session = await getSession({ req })
  if (!session && !file.public_access) {
    res.status(401).json({ error: 'Authentication required.' })
  }

  try {
    const { response, metadata } = await getFileDirectImage(id as string)

    if (file) {
      res.setHeader('Content-Type', metadata.mime_type)
      res.setHeader('Content-Disposition', `attachment; filename=${metadata.name}`)

      const pipeResponse = (res: NextApiResponse) => new Promise<void>((resolve, reject) => {
        response.body.pipe(res)
        response.body.on('end', () => resolve())
        response.body.on('error', (err) => reject(err))
      })

      try {
        await pipeResponse(res)
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    } else {
      res.status(404).json({ error: 'File not found!' })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}