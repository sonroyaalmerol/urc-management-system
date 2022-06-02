import { prisma } from '../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import handleError from '../../../../utils/server/handleError'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import { instituteHeadChecker, roleChecker } from '../../../../utils/roleChecker'
import verifyRequest from '../../../../utils/server/verifyRequest'
import { CONFIRMATION_RESEARCHER_INFORMATION, CREATE_CENTER_NEWS, CREATE_PROJECT_CENTER } from '../../../../utils/permissions'

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as { verified: boolean }
  const { id } = req.query

  const tmpRequest = await prisma.verificationRequest.findUnique({
    where: {
      id: id as string
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
    }
  })

  if (tmpRequest.type === 'INSTITUTE_NEWS' || instituteHeadChecker(session.profile, tmpRequest.project_institute.institute_id)) {
    if (!roleChecker(session.profile, CREATE_CENTER_NEWS)) {
      return res.status(401).json({ error: 'Unauthorized access.' })
    }
  }

  if (tmpRequest.type === 'PROJECT_INSTITUTE' || instituteHeadChecker(session.profile, tmpRequest.project_institute.institute_id)) {
    if (!roleChecker(session.profile, CREATE_PROJECT_CENTER)) {
      return res.status(401).json({ error: 'Unauthorized access.' })
    }
  }

  if (!roleChecker(session.profile, CONFIRMATION_RESEARCHER_INFORMATION)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }
  
  if (body.verified === null || body.verified === undefined) {
    return res.status(400).json({ error: 'State is required!' })
  }

  await verifyRequest(id as string, body.verified, session.profile.id)

  return res.status(200).json({ success: true })
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

    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }, res)
}