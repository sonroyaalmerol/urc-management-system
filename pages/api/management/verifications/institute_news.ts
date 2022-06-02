import { prisma } from '../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'
import slugGenerator from '../../../../utils/slugGenerator'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { BookPublication, FileUpload, InstituteNews, Project, VerificationRequest } from '@prisma/client'

import relevancy from 'relevancy'
import { instituteHeadChecker, roleChecker } from '../../../../utils/roleChecker'
import parseBodyWithFile from '../../../../utils/server/parseBodyWithFile'
import cleanString from '../../../../utils/cleanString'

import handleError from '../../../../utils/server/handleError'
import { deleteFile } from '../../../../utils/server/file'
import { CREATE_CENTER_NEWS, VERIFY_CENTER_NEWS } from '../../../../utils/permissions'
import verifyRequest from '../../../../utils/server/verifyRequest'

export const config = {
  api: {
    bodyParser: false
  }
}

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {

}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body: { files: {
    fieldName: string,
    value: FileUpload
  }[], fields: Partial<
    InstituteNews & VerificationRequest
  >} = await parseBodyWithFile(req, { publicAccess: false })

  if (!roleChecker(session.profile, CREATE_CENTER_NEWS) && !instituteHeadChecker(session.profile, body.fields.institute_id)) {
    for await (const file of body.files) {
      await deleteFile(file.value.id)
    }

    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  if (!cleanString(body.fields.title)) {
    for await (const file of body.files) {
      await deleteFile(file.value.id)
    }

    return res.status(400).json({ error: 'Title is required!' })
  }

  if (!cleanString(body.fields.content)) {
    for await (const file of body.files) {
      await deleteFile(file.value.id)
    }

    return res.status(400).json({ error: 'Content is required!' })
  }

  if (!cleanString(body.fields.institute_id)) {
    for await (const file of body.files) {
      await deleteFile(file.value.id)
    }

    return res.status(400).json({ error: 'Institute is required!' })
  }

  const currentEntry = await prisma.instituteNews.create({
    data: {
      title: body.fields.title,
      content: body.fields.content,
      institute: {
        connect: {
          id: body.fields.institute_id
        }
      },
      profile: {
        connect: {
          id: session.profile.id
        }
      },
      slug: slugGenerator(body.fields.title),
      uploads: {
        connect: body.files?.map(f => ({ id: f.value.id })) || []
      }
    }
  })

  const verificationRequest = await prisma.verificationRequest.create({
    data: {
      profile: {
        connect: {
          id: session.profile.id
        }
      },
      type: 'INSTITUTE_NEWS',
      description: body.fields.description,
      institute_news: {
        connect: {
          id: currentEntry.id
        }
      }
    },
    include: {
      institute_news: true
    }
  })

  if (roleChecker(session.profile, VERIFY_CENTER_NEWS)) {
    await verifyRequest(verificationRequest.id, true, session.profile.id)
  }

  return res.status(200).json({ success: true, data: verificationRequest })
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
  
    if (req.method === 'GET') {
      return await getHandler(req, res, session)
    }
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}