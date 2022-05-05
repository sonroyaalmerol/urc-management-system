import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../../lib/prisma-client'
import fetch from 'node-fetch'

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
  if (!session && !file?.public_access) {
    res.status(401).json({ error: 'Authentication required.' })
  }

  try {
    res.setHeader('Content-Type', file.mime_type)
    res.setHeader('Content-Disposition', `inline; filename=${file.name}`)
    
    const response = await fetch(`https://drive.google.com/uc?export=view&id=${file.google_id}`, {
      method: 'GET',
      headers: {
        'X-Goog-Drive-Resource-Keys': `${file.google_id}/${file.resource_key}`
      },
      redirect: 'follow'
    })

    /* const writableStream = new WritableStream({
      write(chunk: Uint8Array) {
        res.write(chunk)
      },
      close() {
        res.end()
      },
      abort(err) {
        res.end()
        throw err
      }
    }); */

    response.body.pipe(res)

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}