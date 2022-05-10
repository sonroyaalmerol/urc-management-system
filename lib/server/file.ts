import { prisma } from './prisma'
import { nanoid } from 'nanoid/async'
import path from 'path'
import type { FileUpload } from '@prisma/client'
import sharp from 'sharp'
import fs from 'fs/promises'

interface FileProps {
  mimeType: string
  body: Buffer,
  origName: string,
  publicAccess: boolean
}

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-powerpoint'
]

const uploadFile = async (fileProps: FileProps, ownerId: string) : Promise<FileUpload | null> => {
  if (!ALLOWED_MIMES.includes(fileProps.mimeType)) {
    throw new Error(`${fileProps.mimeType} is not allowed for upload.`)
  }
  
  const extension = path.extname(fileProps.origName)

  const randomId = await nanoid(36)

  let toUpload: Buffer = fileProps.body

  const byteSize = Buffer.byteLength(toUpload)

  if (byteSize > 7000000) {
    throw new Error(`File size of ${fileProps.origName} exceeds 7MB.`)
  }

  await fs.mkdir(path.join(process.cwd(), `/storage/${ownerId ?? 'root'}/${extension.replace('.', '')}`), { recursive: true })

  if (fileProps.mimeType.includes('image')) {
    toUpload = await sharp(fileProps.body)
      .jpeg({ progressive: true, force: false, quality: 60 })
      .png({ progressive: true, force: false, compressionLevel: 9 })
      .toBuffer()
  }

  await fs.writeFile(
    path.join(
      process.cwd(),
      `/storage/${ownerId ?? 'root'}/${extension.replace('.', '')}/${randomId}${extension}`
    ), 
  toUpload)

  const fileSize = Buffer.byteLength(toUpload)

  try {
    const [ fileUpload ] = await Promise.all([
      prisma.fileUpload.create({
        data: {
          id: randomId,
          name: fileProps.origName,
          size: fileSize,
          file_type: extension,
          mime_type: fileProps.mimeType,
          public_access: fileProps.publicAccess,
          user: ownerId ? {
            connect: {
              id: ownerId
            }
          } : undefined
        },
      })
    ])
    
    return fileUpload
  } catch (err) {
    await fs.rm(path.join(process.cwd(), `/storage/${ownerId ?? 'root'}/${extension.replace('.', '')}/${randomId}${extension}`))

    throw err
  }
}

const deleteFile = async (fileId: string) : Promise<FileUpload | null> => {
  const file = await prisma.fileUpload.findFirst({
    where: {
      id: fileId
    }
  })

  if (file) {
    await fs.rm(path.join(process.cwd(), `/storage/${file.user_id ?? 'root'}/${file.file_type.replace('.', '')}/${file.id}${file.file_type}`))
  
    return await prisma.fileUpload.delete({
      where: {
        id: fileId
      }
    })
  }

  return null
}

export {
  uploadFile,
  deleteFile
}