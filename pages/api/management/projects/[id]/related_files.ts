import { prisma } from '../../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import type { BudgetProposalSubmission, CapsuleProposalSubmission, DeliverableSubmission, FileUpload, FullBlownProposalSubmission, Submission, SubmissionStatus, SubmissionTypes } from '@prisma/client'
import parseBodyWithFile from '../../../../../utils/server/parseBodyWithFile'
import handleError from '../../../../../utils/server/handleError'
import { memberChecker, roleChecker } from '../../../../../utils/roleChecker'
import { CHANGE_PROJECT_STATUS, REVIEW_PROPOSALS } from '../../../../../utils/permissions'
import { deleteFile } from '../../../../../utils/server/file'
import cleanString from '../../../../../utils/cleanString'
import { ExtendedProject } from '../../../../../types/profile-card'

export const config = {
  api: {
    bodyParser: false
  }
}

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id } = req.query

  const [totalCount, data] = await prisma.$transaction([
    prisma.fileUpload.count({
      where: {
        projects: {
          some: {
            id: id as string
          }
        }
      }
    }),
    prisma.fileUpload.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        projects: {
          some: {
            id: id as string
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
  ])

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id } = req.query

  const tmpProject = await prisma.project.findUnique({
    where: {
      id: id as string
    },
    include: {
      bridge_profiles: true
    }
  }) as Partial<ExtendedProject>

  if (!roleChecker(session.profile, CHANGE_PROJECT_STATUS) && !memberChecker(session.profile, tmpProject.bridge_profiles)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body: { files: {
    fieldName: string,
    value: FileUpload
  }[] } = await parseBodyWithFile(req, { publicAccess: false })

  if (!body) {
    for await (const file of body.files) {
      await deleteFile(file.value.id)
    }

    return res.status(500).json({ error: 'Something went wrong! Please try again.' })
  }

  if (body.files.length === 0) {
    return res.status(400).json({ error: 'A file is required!' })
  }
  
  const relatedFile = await prisma.project.update({
    where: {
      slug: id as string
    },
    data: {
      related_files: {
        connect: body.files?.map((file) => ({id: file.value.id})) ?? []
      }
    },
    include: {
      related_files: true
    }
  })

  return res.status(200).json({ success: true, data: relatedFile })
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body: { fields: Partial<
    FileUpload
  > } = await parseBodyWithFile(req, { publicAccess: false })

  if (!cleanString(body.fields.id)) {
    return res.status(400).json({ error: 'File ID is required!' })
  }

  const file = await deleteFile(body.fields.id)

  return res.status(200).json({ success: true, data: file })
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

    if (req.method === 'DELETE') {
      return await deleteHandler(req, res, session)
    }
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}