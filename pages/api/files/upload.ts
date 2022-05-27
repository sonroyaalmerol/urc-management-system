import { uploadFile } from '../../../lib/server/file'
import { getSession } from 'next-auth/react'
import { IncomingForm } from 'formidable'

import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingMessage } from 'http'
import type { FileUpload } from '@prisma/client'

export const config = {
  api: {
    bodyParser: false
  }
}


const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  const { public_access } = req.query

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }

  if (!session && req.query.secret !== process.env.GOOGLE_DRIVE_FOLDER) {
    return res.status(401).json({ error: `Unauthorized access.` });
  }
  
  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true
  })

  const fileMeta = {
    name: '',
    type: ''
  }

  const bufs: Buffer[] = []
  let buf: Buffer
  form.onPart = (part) => {
    console.log('test')
    if (part.originalFilename === '' || !part.mimetype) {
      // let formidable handle all non-file parts
      console.log('test')
      form._handlePart(part)
      return
    }

    fileMeta.name = part.originalFilename
    fileMeta.type = part.mimetype

    part.on('data', (buffer) => {
      bufs.push(buffer as Buffer)
    })
    
    part.on('end', () => {
      buf = Buffer.concat(bufs)
    })
  }

  const formParseUpload = (req : IncomingMessage) => {
    return new Promise<FileUpload>((resolve, reject) => {
      form.parse(req, (err) => {
        if (err) return reject(err)
        uploadFile({
          mimeType: fileMeta.type,
          body: buf,
          origName: fileMeta.name,
          publicAccess: public_access === 'true'
        }, session?.userId as string).then((file) => {
          resolve(file)
        }).catch((err) => {
          console.error(err.message)
          return reject(err)
        })
      })
    })
  }

  try {
    const fileUploaded = await formParseUpload(req)

    return res.status(200).json(fileUploaded)
  } catch(err) {
    console.error(err.message)
    return res.status(500).json({ error: err.message })
  }
}

export default upload