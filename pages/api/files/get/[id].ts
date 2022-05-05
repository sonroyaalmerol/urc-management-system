import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../../lib/server/prisma'
import fetch from 'node-fetch-cache'
import { Response } from 'node-fetch'

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!req.query.export) {
    res.redirect(req.url.includes('?') ? `${req.url}&export=view` : `?export=view`)
  }

  const file = await prisma.fileUpload.findFirst({
    where: {
      id: id as string
    }
  })
  if (!file) {
    res.status(404).json({ error: 'File not found!' })
  }

  const session = await getSession({ req })
  if (!session && !file?.public_access) {
    res.status(401).json({ error: 'Authentication required.' })
  }

  try {
    res.setHeader('Content-Type', file.mime_type)
    res.setHeader('Content-Disposition', `${req.query.export === 'view' ? 'inline' : 'attachment'}; filename=${file.name}`)
    
    const response: Response = await fetch(`https://drive.google.com/uc?export=view&id=${file.google_id}`, {
      method: 'GET',
      headers: {
        'X-Goog-Drive-Resource-Keys': `${file.google_id}/${file.resource_key}`
      },
      redirect: 'follow'
    })

    return response.body.pipe(res)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}