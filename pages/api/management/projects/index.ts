import { prisma } from '../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'
import slugGenerator from '../../../../utils/slugGenerator'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Project } from '@prisma/client'

import relevancy from 'relevancy'
import { memberChecker, roleChecker } from '../../../../utils/roleChecker'
import handleError from '../../../../utils/server/handleError'
import { CHANGE_PROJECT_STATUS, CREATE_PROJECT } from '../../../../utils/permissions'
import { ExtendedProject } from '../../../../types/profile-card'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const searchQuery = (req.query?.query as string) ?? ''

  const queryFilter = searchQuery.split(' ').filter(s => s.trim().length > 0)
  const queryFields = [
    'title'
  ]
  let orQuery = []
  queryFields.forEach((field) => {
    orQuery = [...orQuery ,...queryFilter.map((word) => ({
      [field]: {
        contains: word,
        mode: 'insensitive'
      }
    }))]
  })

  const whereQuery = searchQuery.trim().length > 0 ? {
    OR: orQuery
  } : undefined

  let [totalCount, data] = await prisma.$transaction([
    prisma.project.count({
      where: {
        bridge_profiles: roleChecker(session.profile, ['researcher'], { exact: true }) ? {
          some: {
            profile_id: session.profile.id
          }
        } : undefined,
        ...whereQuery
      }
    }),
    prisma.project.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        bridge_profiles: roleChecker(session.profile, ['researcher'], { exact: true }) ? {
          some: {
            profile_id: session.profile.id
          }
        } : undefined,
        ...whereQuery
      },
      include: {
        bridge_profiles: {
          include: {
            profile: {
              include: {
                user: true
              }
            }
          }
        },
        project_status: true
      },
      orderBy: {
        updated_at: 'desc'
      }
    })
  ])

  if (searchQuery.trim().length > 0) {
    const fullSearchQuery = queryFilter.join(' ')
    const entryWeights = data.map((entry) => {
      return queryFields.reduce((sum, curr) => {
        if (typeof entry[curr] === 'string' || entry[curr] instanceof String) {
          return relevancy.weight(fullSearchQuery, entry[curr]) + sum
        }
        return sum
      }, 0)
    })
    data = data.map((o, i) => ({ idx: i, obj: o }))
      .sort((a, b) => entryWeights[b.idx] - entryWeights[a.idx])
      .map((x) => x.obj)
  }

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<
    (Project & { mode: 'create' | 'update' }) |
    ({ id: string, email: string, role: string, mode: 'add-proponent' | 'remove-proponent' })
  >

  const id: string = session.profile.id

  let project: Project = null

  let tmpProject: Partial<ExtendedProject> = null
  if ('id' in body) { 
    tmpProject = await prisma.project.findUnique({
      where: {
        id: body.id
      },
      include: {
        bridge_profiles: true
      }
    }) as Partial<ExtendedProject>
  }
  
  if (body.mode === 'create') {
    if (!roleChecker(session.profile, CREATE_PROJECT)) {
      return res.status(401).json({ error: 'Unauthorized access.' })
    }

    if (!body.title) {
      return res.status(400).json({ error: 'Title is required!' })
    }

    project = await prisma.project.create({
      data: {
        title: body.title,
        bridge_profiles: !roleChecker(session.profile, ['researcher']) ? undefined : {
          create: {
            profile_id: id,
            role_title: 'Main Proponent'
          }
        },
        slug: slugGenerator(body.title)
      }
    })
  } else if (body.mode === 'update') {
    if (!roleChecker(session.profile, CHANGE_PROJECT_STATUS) && !memberChecker(session.profile, tmpProject.bridge_profiles)) {
      return res.status(401).json({ error: 'Unauthorized access.' })
    }

    if (!body.title) {
      return res.status(400).json({ error: 'Title is required!' })
    }

    if (!body.project_status_id) {
      return res.status(400).json({ error: 'Project Status is required!' })
    }

    project = await prisma.project.update({
      where: {
        id: body.id
      },
      data: {
        title: body.title,
        slug: slugGenerator(body.title),
        abstract: body.abstract,
        project_status: roleChecker(session.profile, CHANGE_PROJECT_STATUS) ? {
          connect: {
            id: body.project_status_id as string
          }
        } : undefined
      },
      include: {
        bridge_profiles: {
          include: {
            profile: {
              include: {
                user: true
              }
            }
          }
        },
        project_status: true
      }
    })
  } else if (body.mode === 'add-proponent') {
    if (!roleChecker(session.profile, CHANGE_PROJECT_STATUS) && !memberChecker(session.profile, tmpProject.bridge_profiles)) {
      return res.status(401).json({ error: 'Unauthorized access.' })
    }


    if (!body.email) {
      return res.status(400).json({ error: 'Email is required!' })
    }

    if (!body.role) {
      return res.status(400).json({ error: 'Role is required!' })
    }

    try {
      project = await prisma.project.update({
        where: {
          id: body.id
        },
        data: {
          bridge_profiles: {
            create: {
              role_title: body.role,
              profile: {
                connect: {
                  email: body.email as string
                }
              }
            }
          }
        }
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  } else if (body.mode === 'remove-proponent') {
    if (!roleChecker(session.profile, CHANGE_PROJECT_STATUS) && !memberChecker(session.profile, tmpProject.bridge_profiles)) {
      return res.status(401).json({ error: 'Unauthorized access.' })
    }


    if (!body.email) {
      return res.status(400).json({ error: 'Email is required!' })
    }

    try {
      await prisma.profileToProjectBridge.deleteMany({
        where: {
          profile: {
            email: body.email
          },
          project: {
            id: body.id
          }
        }
      })
    } catch (err) {
      return res.status(500).json({ error: err.message })
    }
  }

  return res.status(200).json({ success: true, data: project })
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