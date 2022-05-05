import { drive_v3, google } from 'googleapis'
import { prisma } from './prisma'
import { nanoid } from 'nanoid/async'
import path from 'path'
import type { FileUpload } from '@prisma/client'
import { PassThrough } from 'stream'
import sharp from 'sharp'
import auth from './google-auth'

const drive = google.drive({
  version: 'v3',
  auth
})

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
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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

  if (fileProps.mimeType.includes('image')) {
    toUpload = await sharp(fileProps.body)
      .jpeg({ progressive: true, force: false, quality: 60 })
      .png({ progressive: true, force: false, compressionLevel: 9 })
      .toBuffer()
  }

  const bufferStream = new PassThrough()
  bufferStream.end(toUpload)

  const file = await drive.files.create({
    media: {
      mimeType: fileProps.mimeType,
      body: bufferStream
    },
    requestBody: {
      parents: [process.env.GOOGLE_DRIVE_FOLDER],
      name: `${ownerId ?? 'root'}__${randomId}${extension}`
    },
  })

  try {
    const [ fileUpload ] = await Promise.all([
      prisma.fileUpload.create({
        data: {
          id: randomId,
          google_id: file.data.id,
          name: fileProps.origName,
          file_type: extension,
          mime_type: fileProps.mimeType,
          resource_key: file.data.resourceKey,
          public_access: fileProps.publicAccess,
          user: ownerId ? {
            connect: {
              id: ownerId
            }
          } : undefined
        },
      }),
      drive.permissions.create({
        fileId: file.data.id,
        requestBody: {
          type: 'anyone',
          role: 'reader'
        }
      })
    ])
    
    return fileUpload
  } catch (err) {
    await drive.files.delete({
      fileId: file.data.id
    })
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
    await drive.files.delete({
      fileId: file.google_id
    })
  
    return await prisma.fileUpload.delete({
      where: {
        id: fileId
      }
    })
  }

  return null
}

const deleteUnusedFiles = async () : Promise<any> => {
  let pageToken: string = null
  const allDriveFilesRaw: drive_v3.Schema$File[] = []

  do {
    try {
      const files = await drive.files.list({
        pageToken,
        q: `'${process.env.GOOGLE_DRIVE_FOLDER}' in parents and trashed=false`
      })

      allDriveFilesRaw.push(...files.data.files)
      pageToken = files.data.nextPageToken
    } catch (err) {
      pageToken = null
    }
  } while (pageToken)

  const allDriveFiles: Array<{ google_id: string }> = allDriveFilesRaw.map((file) => {
    return {
      google_id: file.id
    }
  })

  const allUploads = await prisma.fileUpload.findMany({
    select: {
      google_id: true
    }
  })

  const uselessDriveFiles = allDriveFiles.filter(file => !allUploads.includes(file))

  await Promise.all(uselessDriveFiles.map(async (driveFile) => {
    await drive.files.delete({
      fileId: driveFile.google_id
    })
  }))
}

export {
  uploadFile,
  deleteFile,
  deleteUnusedFiles
}