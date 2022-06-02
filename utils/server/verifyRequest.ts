import { prisma } from "./prisma"

const verifyRequest = async (id: string, verified: boolean, profileId: string) => {
  const verificationRequest = await prisma.verificationRequest.update({
    where: {
      id: id as string
    },
    data: {
      status: verified ? 'VERIFIED': 'INVALID',
      verified_by: {
        connect: {
          id: profileId
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
            verified: verified
          }
        }),
        prisma.bookPublication.update({
          where: {
            id: verificationRequest.book_publication_id
          },
          data: {
            bridge_profiles: verified ? {
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
            verified: verified
          }
        }),
        prisma.externalResearch.update({
          where: {
            id: verificationRequest.external_research_id
          },
          data: {
            bridge_profiles: verified ? {
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
            verified: verified
          }
        }),
        prisma.journalPublication.update({
          where: {
            id: verificationRequest.journal_publication_id
          },
          data: {
            bridge_profiles: verified ? {
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
            verified: verified
          }
        }),
        prisma.researchDissemination.update({
          where: {
            id: verificationRequest.research_dissemination_id
          },
          data: {
            bridge_profiles: verified ? {
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
            verified: verified
          }
        }),
        prisma.researchEvent.update({
          where: {
            id: verificationRequest.research_event_id
          },
          data: {
            bridge_profiles: verified ? {
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
            verified: verified
          }
        }),
        prisma.researchPresentation.update({
          where: {
            id: verificationRequest.research_presentation_id
          },
          data: {
            bridge_profiles: verified ? {
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
              verified: verified
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
              verified: verified
            }
          })
        ])
        break
  }
}

export default verifyRequest