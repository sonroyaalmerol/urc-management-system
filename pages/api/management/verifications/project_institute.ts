import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'
import slugGenerator from '../../../../lib/slugGenerator'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { BookPublication, FileUpload, InstituteNews, Project, ProjectToInstituteBridge, VerificationRequest } from '@prisma/client'

import relevancy from 'relevancy'
import roleChecker from '../../../../lib/roleChecker'
import parseBodyWithFile from '../../../../lib/server/parseBodyWithFile'
import cleanString from '../../../../lib/cleanString'

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
    ProjectToInstituteBridge & VerificationRequest
  >} = await parseBodyWithFile(req, { publicAccess: false })

  if (!cleanString(body.fields.project_id)) {
    return res.status(400).json({ error: 'Project is required!' })
  }

  if (!cleanString(body.fields.institute_id)) {
    return res.status(400).json({ error: 'Institute is required!' })
  }

  const currentEntry = await prisma.projectToInstituteBridge.create({
    data: {
      institute: {
        connect: {
          id: body.fields.institute_id
        }
      },
      project: {
        connect: {
          id: body.fields.project_id
        }
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
      type: 'PROJECT_INSTITUTE',
      project_institute: {
        connect: {
          project_id_institute_id: {
            project_id: currentEntry.project_id,
            institute_id: currentEntry.institute_id
          }
        }
      }
    },
    include: {
      project_institute: true
    }
  })

  return res.status(200).json({ success: true, data: verificationRequest })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  if (req.method === 'POST') {
    return await postHandler(req, res, session);
  }

  if (req.method === 'GET') {
    return await getHandler(req, res, session)
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}