import { google } from 'googleapis'
import prisma from './prisma-client'
import { nanoid } from 'nanoid/async'
import path from 'path'
import fetch, { Response } from 'node-fetch'
import type { FileUpload } from '@prisma/client'
import { Readable } from 'stream'

const auth = new google.auth.GoogleAuth({
  keyFile: 'urc-management-service-account.json',
  scopes: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/drive.file'
  ],
});

const drive = google.drive({
  version: 'v3',
  auth
})

interface FileProps {
  mimeType: string
  body: Readable,
  origName: string
}

const uploadFile = async (fileProps: FileProps, ownerId: string) : Promise<FileUpload | null> => {
  const extension = path.extname(fileProps.origName)

  console.log(fileProps)
  const randomFileName = await nanoid()
  const file = await drive.files.create({
    media: {
      mimeType: fileProps.mimeType,
      body: fileProps.body
    },
    requestBody: {
      parents: [process.env.GOOGLE_DRIVE_FOLDER],
      name: `${ownerId}__${randomFileName}${extension}`
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
        user: {
          connect: {
            id: ownerId
          }
        }
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

const getFileDirectImage = async (fileId: string) : Promise<{ response: Response, metadata: FileUpload }> => {
  const file = await prisma.fileUpload.findFirst({
    where: {
      id: fileId
    }
  })

  if (file) {
    const response = await fetch(`https://drive.google.com/uc?export=view&id=${file.google_id}`, {
      method: 'GET',
      headers: {
        'X-Goog-Drive-Resource-Keys': `${file.google_id}/${file.resource_key}`
      },
      redirect: 'follow'
    })

    return { response, metadata: file }
  }

  return { response: null, metadata: null }
}

export {
  uploadFile,
  deleteFile,
  getFileDirectImage
}