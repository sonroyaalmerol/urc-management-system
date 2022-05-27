import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'
import slugGenerator from '../../../../lib/slugGenerator'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { VerificationStatus, VerificationTypes } from '@prisma/client'

import roleChecker from '../../../../lib/roleChecker'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { types: types_raw, status: status_raw } = req.query

  const types = (types_raw as string)?.split(',').map((i) => i.trim().toUpperCase()) as VerificationTypes[] ?? []

  let [totalCount, data] = await prisma.$transaction([
    prisma.verificationRequest.count({
      where: {
        type: {
          in: types
        },
        status: 'NOT_VERIFIED'
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
        status: 'NOT_VERIFIED'
      },
      include: {
        external_research: true,
        journal_publication: true,
        book_publication: true,
        research_dissemination: true,
        research_event_attendance: true,
        research_presentation: true,
        proof_uploads: true,
        profile: true
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

  if (req.method === 'POST') {
    return await postHandler(req, res, session);
  }

  if (req.method === 'GET') {
    return await getHandler(req, res, session)
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}