import { prisma } from '../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'
import slugGenerator from '../../../../utils/slugGenerator'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { BookPublication, FileUpload, Institute, InstituteNews, Project, ProjectToInstituteBridge, VerificationRequest } from '@prisma/client'

import relevancy from 'relevancy'
import { instituteHeadChecker, memberChecker, roleChecker } from '../../../../utils/roleChecker'
import parseBodyWithFile from '../../../../utils/server/parseBodyWithFile'
import cleanString from '../../../../utils/cleanString'
import handleError from '../../../../utils/server/handleError'
import { CHANGE_PROJECT_STATUS, CREATE_PROJECT_CENTER, VERIFY_CENTER_PROJECTS } from '../../../../utils/permissions'
import verifyRequest from '../../../../utils/server/verifyRequest'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {

}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<
    ProjectToInstituteBridge & VerificationRequest & Institute
  >

  if (!cleanString(body.project_id)) {
    return res.status(400).json({ error: 'Project is required!' })
  }

  if (!cleanString(body.name)) {
    return res.status(400).json({ error: 'Institute is required!' })
  }

  const [tmpProject, tmpInstitute] = await prisma.$transaction([
    prisma.project.findUnique({
      where: {
        id: body.project_id
      },
      include: {
        bridge_profiles: true
      }
    }),
    prisma.institute.findUnique({
      where: {
        name: body.name
      }
    })
  ])

  if (
    !roleChecker(session.profile, CREATE_PROJECT_CENTER) &&
    !memberChecker(session.profile, tmpProject.bridge_profiles) &&
    !instituteHeadChecker(session.profile, tmpInstitute.id)
  ) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const currentEntry = await prisma.projectToInstituteBridge.create({
    data: {
      institute: {
        connect: {
          name: body.name
        }
      },
      project: {
        connect: {
          id: body.project_id
        }
      }
    }
  })

  if (currentEntry) {
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

    if (roleChecker(session.profile, VERIFY_CENTER_PROJECTS)) {
      await verifyRequest(verificationRequest.id, true, session.profile.id)
    }

    return res.status(200).json({ success: true, data: verificationRequest })
  }

  return res.status(404).json({ error: 'Institute not found!' })
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