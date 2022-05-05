import { drive_v3, google } from 'googleapis'
import { prisma } from './prisma-client'
import { nanoid } from 'nanoid/async'
import path from 'path'
import type { FileUpload } from '@prisma/client'
import { Readable } from 'stream'

const auth = new google.auth.GoogleAuth({
  keyFile: 'urc-management-service-account.json',
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file'
  ],
})

google.options({
  // http2: true,
})

const drive = google.drive({
  version: 'v3',
  auth
})

interface FileProps {
  mimeType: string
  body: Readable,
  origName: string,
  publicAccess: boolean
}

const uploadFile = async (fileProps: FileProps, ownerId: string) : Promise<FileUpload | null> => {
  const extension = path.extname(fileProps.origName)
  
  const randomFileName = await nanoid()
  const file = await drive.files.create({
    media: {
      mimeType: fileProps.mimeType,
      body: fileProps.body
    },
    requestBody: {
      parents: [process.env.GOOGLE_DRIVE_FOLDER],
      name: `${ownerId ?? 'root'}__${randomFileName}${extension}`
    },
  })

  await drive.permissions.create({
    fileId: file.data.id,
    requestBody: {
      type: 'anyone',
      role: 'reader'
    }
  })

  try {
    const fileUpload = await prisma.fileUpload.create({
      data: {
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
      }
    })

    return fileUpload
  } catch (err) {
    await drive.files.delete({
      fileId: file.data.id
    })
    throw err
  }
}

const deleteFile = async (fileId: string) : Promise<any> => {
  const file = await prisma.fileUpload.findFirst({
    where: {
      id: fileId
    }
  })

  if (file) {
    await drive.files.delete({
      fileId: file.google_id
    })
  
    await prisma.fileUpload.delete({
      where: {
        id: fileId
      }
    })
  }
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