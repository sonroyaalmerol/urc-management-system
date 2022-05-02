import { uploadFile } from '../../../lib/drive-client'
import { getSession } from 'next-auth/react'
import { IncomingForm } from 'formidable'
import { PassThrough } from 'stream'

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
  
  if (req.method === 'POST' && session) {
    const { userId } = session

    const pass = new PassThrough()
    const form = new IncomingForm({
      multiples: false,
      keepExtensions: true
    })

    const fileMeta = {
      name: '',
      type: ''
    }

    form.onPart = (part) => {
      if (part.originalFilename === '' || !part.mimetype) {
        // let formidable handle all non-file parts
        form._handlePart(part)
        return
      }

      fileMeta.name = part.originalFilename
      fileMeta.type = part.mimetype

      part.on('data', (buffer) => {
        pass.write(buffer)
      })
      
      part.on('end', () => {
        pass.end()
      })
    }

    const formParseUpload = (req : IncomingMessage) => {
      return new Promise<FileUpload>((resolve, reject) => {
        form.parse(req, (err) => {
          if (err) return reject(err)

          uploadFile({
            mimeType: fileMeta.type,
            body: pass,
            origName: fileMeta.name
          }, userId as string).then((file) => {
            console.log(file)
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

      res.status(200).json({ data: fileUploaded })
    } catch(err) {
      res.status(500).json({ error: err })
    }

  } else {
    // Handle any other HTTP method
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}

export default upload