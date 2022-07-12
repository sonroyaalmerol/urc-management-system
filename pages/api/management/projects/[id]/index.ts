import { prisma } from '../../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import type { BudgetProposalSubmission, CapsuleProposalSubmission, DeliverableSubmission, FileUpload, FullBlownProposalSubmission, Submission, SubmissionStatus, SubmissionTypes } from '@prisma/client'
import parseBodyWithFile from '../../../../../utils/server/parseBodyWithFile'
import handleError from '../../../../../utils/server/handleError'
import { memberChecker, roleChecker } from '../../../../../utils/roleChecker'
import { REVIEW_PROPOSALS } from '../../../../../utils/permissions'
import { deleteFile } from '../../../../../utils/server/file'

export const config = {
  api: {
    bodyParser: false
  }
}

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
        deliverable_submission: {
          include: {
            deliverable: true
          }
        },
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
  const { id } = req.query

  const body: { files: {
    fieldName: string,
    value: FileUpload
  }[], fields: (
    Partial<Submission> &
    Partial<BudgetProposalSubmission> &
    Partial<FullBlownProposalSubmission> &
    Partial<CapsuleProposalSubmission> &
    Partial<DeliverableSubmission>
  ) } = await parseBodyWithFile(req, { publicAccess: false })

  if (!body) {
    for await (const file of body.files) {
      await deleteFile(file.value.id)
    }

    return res.status(500).json({ error: 'Something went wrong! Please try again.' })
  }

  if (body.files.length === 0 && (body.fields.type === 'BUDGET' || body.fields.type === 'FULL')) {
    return res.status(400).json({ error: 'A file is required!' })
  }
  
  const submission = await prisma.submission.create({
    data: {
      type: body.fields.type,
      project: {
        connect: {
          id: id as string
        }
      },
      profile: {
        connect: {
          id: session.profile.id
        }
      },
      files: {
        connect: body.files?.map((file) => ({id: file.value.id})) ?? []
      }
    },
    include: {
      project: {
        include: {
          bridge_profiles: true
        }
      }
    }
  })

  let specificSubmission: BudgetProposalSubmission | FullBlownProposalSubmission | CapsuleProposalSubmission | DeliverableSubmission

  if (body.fields.type === 'BUDGET') {
    if (!memberChecker(session.profile, submission.project.bridge_profiles)) {
      for await (const file of body.files) {
        await deleteFile(file.value.id)
      }

      return res.status(401).json({ error: 'Unauthorized access.' })
    }

    specificSubmission = await prisma.budgetProposalSubmission.create({
      data: {
        submission: {
          connect: {
            id: submission.id
          }
        }
      }
    })
  }

  if (body.fields.type === 'FULL') {
    if (!memberChecker(session.profile, submission.project.bridge_profiles)) {
      for await (const file of body.files) {
        await deleteFile(file.value.id)
      }

      return res.status(401).json({ error: 'Unauthorized access.' })
    }

    specificSubmission = await prisma.fullBlownProposalSubmission.create({
      data: {
        submission: {
          connect: {
            id: submission.id
          }
        },
        description: body.fields.description
      }
    })
  }

  if (body.fields.type === 'CAPSULE') {
    if (!memberChecker(session.profile, submission.project.bridge_profiles)) {
      for await (const file of body.files) {
        await deleteFile(file.value.id)
      }

      return res.status(401).json({ error: 'Unauthorized access.' })
    }

    specificSubmission = await prisma.capsuleProposalSubmission.create({
      data: {
        tentative_budget: 0,
        tentative_schedule: '',
        /* TODO: Research Thrust, Tentative Budget and Schedule */
        brief_background: body.fields.brief_background,
        objectives_of_the_study: body.fields.objectives_of_the_study,
        significance_of_the_study: body.fields.significance_of_the_study,
        methodology: body.fields.methodology,
        submission: {
          connect: {
            id: submission.id
          }
        }
      }
    })
  }

  if (body.fields.type === 'DELIVERABLE') {
    if (!memberChecker(session.profile, submission.project.bridge_profiles)) {
      for await (const file of body.files) {
        await deleteFile(file.value.id)
      }

      return res.status(401).json({ error: 'Unauthorized access.' })
    }

    specificSubmission = await prisma.deliverableSubmission.create({
      data: {
        deliverable: {
          connect: {
            id: body.fields.deliverable_id
          }
        },
        description: body.fields.description,
        submission: {
          connect: {
            id: submission.id
          }
        }
      }
    })
  }

  return res.status(200).json({ success: true, data: submission, subdata: specificSubmission })
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