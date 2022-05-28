import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as { verified: boolean }
  const { id } = req.query
  
  if (body.verified === null || body.verified === undefined) {
    return res.status(400).json({ error: 'State is required!' })
  }

  const verificationRequest = await prisma.verificationRequest.update({
    where: {
      id: id as string
    },
    data: {
      status: body.verified ? 'VERIFIED': 'INVALID',
      verified_by: {
        connect: {
          id: session.profile.id
        }
      }
    }
  })

  console.log(verificationRequest)

  switch (verificationRequest.type) {
    case 'BOOK_PUBLICATION':
      await prisma.$transaction([
        prisma.bookPublication.updateMany({
          where: {
            id: verificationRequest.book_publication_id,
            verified: false
          },
          data: {
            verified: body.verified
          }
        }),
        prisma.bookPublication.update({
          where: {
            id: verificationRequest.book_publication_id
          },
          data: {
            bridge_profiles: body.verified ? {
              create: {
                role_title: verificationRequest.role,
                profile: {
                  connect: {
                    id: verificationRequest.profile_id
                  }
                }
              }
            } : {
              deleteMany: {
                profile_id: verificationRequest.profile_id
              }
            }
          }
        })
      ])
      break
    case 'EXTERNAL_RESEARCH':
      await prisma.$transaction([
        prisma.externalResearch.updateMany({
          where: {
            id: verificationRequest.external_research_id,
            verified: false
          },
          data: {
            verified: body.verified
          }
        }),
        prisma.externalResearch.update({
          where: {
            id: verificationRequest.external_research_id
          },
          data: {
            bridge_profiles: body.verified ? {
              create: {
                role_title: verificationRequest.role,
                profile: {
                  connect: {
                    id: verificationRequest.profile_id
                  }
                }
              }
            } : {
              deleteMany: {
                profile_id: verificationRequest.profile_id
              }
            }
          }
        })
      ])
      break
    case 'JOURNAL_PUBLICATION':
      await prisma.$transaction([
        prisma.journalPublication.updateMany({
          where: {
            id: verificationRequest.journal_publication_id,
            verified: false
          },
          data: {
            verified: body.verified
          }
        }),
        prisma.journalPublication.update({
          where: {
            id: verificationRequest.journal_publication_id
          },
          data: {
            bridge_profiles: body.verified ? {
              create: {
                role_title: verificationRequest.role,
                profile: {
                  connect: {
                    id: verificationRequest.profile_id
                  }
                }
              }
            } : {
              deleteMany: {
                profile_id: verificationRequest.profile_id
              }
            }
          }
        })
      ])
      break
    case 'RESEARCH_DISSEMINATION':
      await prisma.$transaction([
        prisma.researchDissemination.updateMany({
          where: {
            id: verificationRequest.research_dissemination_id,
            verified: false
          },
          data: {
            verified: body.verified
          }
        }),
        prisma.researchDissemination.update({
          where: {
            id: verificationRequest.research_dissemination_id
          },
          data: {
            bridge_profiles: body.verified ? {
              create: {
                role_title: verificationRequest.role,
                profile: {
                  connect: {
                    id: verificationRequest.profile_id
                  }
                }
              }
            } : {
              deleteMany: {
                profile_id: verificationRequest.profile_id
              }
            }
          }
        })
      ])
      break
    case 'RESEARCH_EVENT_ATTENDANCE':
      await prisma.$transaction([
        prisma.researchEventAttendance.updateMany({
          where: {
            id: verificationRequest.research_event_attendance_id,
            verified: false
          },
          data: {
            verified: body.verified
          }
        }),
        prisma.researchEventAttendance.update({
          where: {
            id: verificationRequest.research_event_attendance_id
          },
          data: {
            profile: body.verified ? {
              connect: {
                id: verificationRequest.profile_id
              }
            } : null
          }
        })
      ])
      break
    case 'RESEARCH_PRESENTATION':
      await prisma.$transaction([
        prisma.researchPresentation.updateMany({
          where: {
            id: verificationRequest.research_presentation_id,
            verified: false
          },
          data: {
            verified: body.verified
          }
        }),
        prisma.researchPresentation.update({
          where: {
            id: verificationRequest.research_presentation_id
          },
          data: {
            bridge_profiles: body.verified ? {
              create: {
                role_title: verificationRequest.role,
                profile: {
                  connect: {
                    id: verificationRequest.profile_id
                  }
                }
              }
            } : {
              deleteMany: {
                profile_id: verificationRequest.profile_id
              }
            }
          }
        })
      ])
      break
  }

  return res.status(200).json({ success: true })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  if (req.method === 'POST') {
    return await postHandler(req, res, session);
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}