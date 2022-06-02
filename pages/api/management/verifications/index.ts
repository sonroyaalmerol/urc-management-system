import { prisma } from '../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'
import slugGenerator from '../../../../utils/slugGenerator'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { VerificationStatus, VerificationTypes } from '@prisma/client'

import handleError from '../../../../utils/server/handleError'

import { instituteHeadChecker, roleChecker } from '../../../../utils/roleChecker'
import { CONFIRMATION_RESEARCHER_INFORMATION, CREATE_CENTER_NEWS, VERIFY_CENTER_NEWS, VERIFY_CENTER_PROJECTS } from '../../../../utils/permissions'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { types: types_raw, status: status_raw } = req.query

  let types = (types_raw as string)?.split(',').map((i) => i.trim().toUpperCase()) as VerificationTypes[] ?? []
  const status = (status_raw as string)?.split(',').map((i) => i.trim().toUpperCase()) as VerificationStatus[] ?? []

  types = types.filter((type) => {
    if (type === 'INSTITUTE_NEWS') {
      return roleChecker(session.profile, VERIFY_CENTER_NEWS)
    }

    if (type === 'PROJECT_INSTITUTE') {
      return roleChecker(session.profile, VERIFY_CENTER_PROJECTS)
    }

    return roleChecker(session.profile, CONFIRMATION_RESEARCHER_INFORMATION)
  })

  let [totalCount, data] = await prisma.$transaction([
    prisma.verificationRequest.count({
      where: {
        type: {
          in: types
        },
        status: {
          in: status
        }
      }
    }),
    prisma.verificationRequest.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        type: {
          in: types
        },
        status: {
          in: status
        }
      },
      include: {
        external_research: true,
        journal_publication: true,
        book_publication: true,
        research_dissemination: true,
        research_event: true,
        research_presentation: true,
        proof_uploads: true,
        profile: true,
        institute_news: {
          include: {
            institute: true,
            uploads: true
          }
        },
        project_institute: {
          include: {
            project: true,
            institute: true
          }
        }
      },
      orderBy: {
        updated_at: 'desc'
      }
    })
  ])

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {

  return res.status(401).json({ error: 'Unauthorized access.' })
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