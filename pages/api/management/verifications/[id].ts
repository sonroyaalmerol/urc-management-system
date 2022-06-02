import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import handleError from '../../../../lib/server/handleError'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import { roleChecker } from '../../../../lib/roleChecker'

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_staff'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

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
    case 'RESEARCH_EVENT':
      await prisma.$transaction([
        prisma.researchEvent.updateMany({
          where: {
            id: verificationRequest.research_event_id,
            verified: false
          },
          data: {
            verified: body.verified
          }
        }),
        prisma.researchEvent.update({
          where: {
            id: verificationRequest.research_event_id
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
      case 'INSTITUTE_NEWS':
        await prisma.$transaction([
          prisma.instituteNews.update({
            where: {
              id: verificationRequest.institute_news_id
            },
            data: {
              verified: body.verified
            }
          })
        ])
        break
      case 'PROJECT_INSTITUTE':
        await prisma.$transaction([
          prisma.projectToInstituteBridge.update({
            where: {
              project_id_institute_id: {
                project_id: verificationRequest.project_institute_project_id,
                institute_id: verificationRequest.project_institute_institute_id
              }
            },
            data: {
              verified: body.verified
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

  return await handleError(async () => {
    if (req.method === 'POST') {
      return await postHandler(req, res, session);
    }

    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }, res)
}