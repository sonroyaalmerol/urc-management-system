import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../../lib/server/prisma'

import path from 'path'
import fs from 'fs/promises'
import { PassThrough } from 'stream'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!req.query.export) {
    return res.redirect(req.url.includes('?') ? `${req.url}&export=view` : `?export=view`)
  }

  const file = await prisma.fileUpload.findFirst({
    where: {
      id: id as string
    }
  })
  if (!file) {
    return res.status(404).json({ error: 'File not found!' })
  }

  const session = await getSession({ req })
  if (!session && !file?.public_access) {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  try {
    const response = await fs.readFile(path.join(
      process.cwd(),
      `/storage/${file.user_id ?? 'root'}/${file.file_type.replace('.', '')}/${file.id}${file.file_type}`
    ))

    const pass = new PassThrough()
    pass.end(response)
    
    return pass.pipe(res)
      .setHeader('Content-Type', file.mime_type)
      .setHeader('Content-Disposition', `${req.query.export === 'view' ? 'inline' : 'attachment'}; filename=${file.name}`)
      .setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
      )

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}