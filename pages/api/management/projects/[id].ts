import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import type { SubmissionStatus, SubmissionTypes } from '@prisma/client'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id, types: types_raw, status: status_raw } = req.query

  const types = (types_raw as string)?.split(',').map((i) => i.trim().toUpperCase()) as SubmissionTypes[] ?? []
  const status = (status_raw as string)?.split(',').map((i) => i.trim().toUpperCase()) as SubmissionStatus[] ?? []

  const [totalCount, data] = await prisma.$transaction([
    prisma.submission.count({
      where: {
        project_id: id as string,
        type: {
          in: types
        },
        status: {
          in: status
        }
      }
    }),
    prisma.submission.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        project_id: id as string,
        type: {
          in: types
        },
        status: {
          in: status
        }
      },
      include: {
        files: true,
        deliverable_submission: true,
        budget_proposal_submission: true,
        full_blown_proposal_submission: true,
        capsule_proposal_submission: true,
        profile: {
          include: {
            user: true
          }
        },
        project: true
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