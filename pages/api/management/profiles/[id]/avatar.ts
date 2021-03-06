import { prisma } from '../../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { FileUpload, UserRole } from '@prisma/client'
import parseBodyWithFile from '../../../../../utils/server/parseBodyWithFile'
import { deleteFile } from '../../../../../utils/server/file'
import handleError from '../../../../../utils/server/handleError'

export const config = {
  api: {
    bodyParser: false
  }
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {

  const body: { files: {
    fieldName: string,
    value: FileUpload
  }[] } = await parseBodyWithFile(req, { publicAccess: true })

  if (body.files?.length < 1) {
    return res.status(400).json({ error: 'A file is required!' })
  }

  await deleteFile(session.profile.photo_id)
  await prisma.profile.update({
    where: {
      id: session.profile.id
    },
    data: {
      photo: {
        connect: {
          id: body.files[0].value.id
        }
      }
    }
  })

  return res.status(200).json({ success: true, data: body.files[0].value.id })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  return await handleError(async () => {
    if (req.method === 'POST') {
      return await postHandler(req, res, session);
    }
  
    if (req.method === 'DELETE') {
      return await deleteHandler(req, res, session)
    }
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}