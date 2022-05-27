import { uploadFile } from './file'
import { getSession } from 'next-auth/react'
import { IncomingForm } from 'formidable'

import type { NextApiRequest } from 'next'
import { IncomingMessage } from 'http'
import type { FileUpload } from '@prisma/client'


const parseBodyWithFile = async (req: NextApiRequest, publicAccess: boolean) => {
  const session = await getSession({ req })
  
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
    if (part.originalFilename === '' || !part.mimetype) {
      // let formidable handle all non-file parts
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
    return new Promise<{ file: FileUpload, fields: any }>((resolve, reject) => {
      form.parse(req, (err, fields) => {
        if (err) return reject(err)
        const processedFields = {}
        Object.keys(fields).forEach((key) => {
          processedFields[key] = fields[key][0]
        })
        if (buf) {
          uploadFile({
            mimeType: fileMeta.type,
            body: buf,
            origName: fileMeta.name,
            publicAccess: publicAccess,
          }, session?.profile.id as string).then((file) => {
            resolve({file, fields: processedFields})
          }).catch((err) => {
            console.error(err.message)
            return reject(err)
          })
        } else {
          resolve({ file: null, fields: processedFields })
        }
      })
    })
  }

  try {
    const fileUploaded = await formParseUpload(req)

    return fileUploaded
  } catch(err) {
    console.log(err)
    return null
  }
}

export default parseBodyWithFile