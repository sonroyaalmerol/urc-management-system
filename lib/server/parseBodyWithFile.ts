import { getSession } from 'next-auth/react'
import formidable from 'formidable'
import { nanoid } from 'nanoid/async'
import path from 'path'
import sharp from 'sharp'
import fs from 'fs/promises'

import type { NextApiRequest } from 'next'
import os from 'node:os'
import { prisma } from './prisma'
import type { FileUpload } from '@prisma/client'

interface ParseResponse {
  files: {
    fieldName: string,
    value: FileUpload
  }[]
  fields: {
    [key: string]: any
  }
}

interface ParseFileOptions {
  publicAccess?: boolean
}

const parseBodyWithFile = async (req: NextApiRequest, options?: ParseFileOptions) => {
  const session = await getSession({ req })
  
  const parse = (req: NextApiRequest) => new Promise<ParseResponse>(async (resolve, reject) => {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir: path.join(
        process.cwd(),
        `/storage/tmp`
      )
    })

    await fs.mkdir(path.join(
      process.cwd(),
      `/storage/tmp`
    ), { recursive: true })

    let files = []
    let fields = {}
    let filesTmp = []
    form
      .on('field', (fieldName, value) => {
        fields = { ...fields, [fieldName]: value }
      })
      .on('file', async (fieldName, file) => {
        filesTmp.push({fieldName, file})
      })
      .on('end', async () => {
        const ownerId = session.profile.id

        await Promise.all(filesTmp.map(async ({fieldName, file}) => {
          const extension = path.extname(file.originalFilename)
          const randomId = await nanoid(36)

          const byteSize = file.size

          if (byteSize > 7000000) {
            reject(new Error(`File size of ${file.originalFilename} exceeds 7MB.`))
          }
          
          const destinationFolder = path.join(
            process.cwd(),
            `/storage/${ownerId ?? 'root'}/${extension.replace('.', '')}`
          )

          await fs.mkdir(destinationFolder, { recursive: true })

          if (file.mimetype.includes('image')) {
            await sharp(file.filepath)
              .jpeg({ progressive: true, force: false, quality: 60 })
              .png({ progressive: true, force: false, compressionLevel: 9 })
              .toFile(path.join(
                destinationFolder, `/${randomId}${extension}`
              ))
          } else {
            await fs.rename(
              file.filepath, 
              path.join(
                destinationFolder, `/${randomId}${extension}`
              )
            )
          }
          
          try {
            const [ fileUpload ] = await Promise.all([
              prisma.fileUpload.create({
                data: {
                  id: randomId,
                  name: file.originalFilename,
                  size: byteSize,
                  file_type: extension,
                  mime_type: file.mimetype,
                  public_access: options?.publicAccess ?? false,
                  profile: ownerId ? {
                    connect: {
                      id: ownerId
                    }
                  } : undefined
                },
              })
            ])
            files.push({ fieldName, value: fileUpload })
          } catch (err) {
            await fs.rm(path.join(process.cwd(), `/storage/${ownerId ?? 'root'}/${extension.replace('.', '')}/${randomId}${extension}`))
            reject(err)
          }
        }))
        resolve({files, fields})
      })

    form.parse(req)
  })

  return await parse(req)
}

export default parseBodyWithFile