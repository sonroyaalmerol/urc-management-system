import { prisma } from '../../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Profile, ProfileToInstituteBridge } from '@prisma/client'
import cleanString from '../../../../../lib/cleanString'
import handleError from '../../../../../lib/server/handleError'
import handleDate from '../../../../../lib/server/handleDate'
import { roleChecker } from '../../../../../lib/roleChecker'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const searchQuery = (req.query?.query as string) ?? ''

  const queryFilter = searchQuery.split(' ').filter(s => s.trim().length > 0)
  const queryFields = [
    'email', 'first_name', 'middle_initial', 'last_name', 'honorific', 'titles'
  ]
  let orQuery = []
  queryFields.forEach((field) => {
    orQuery = [...orQuery ,...queryFilter.map((word) => ({
      [field]: {
        contains: word
      }
    }))]
  })

  const whereQuery = searchQuery.trim().length > 0 ? {
    OR: orQuery
  } : undefined

  let [totalCount, data] = await prisma.$transaction([
    prisma.profile.count({
      where: {
        ...whereQuery,
        bridge_institutes: {
          some: {
            institute: {
              id: req.query.id as string
            }
          }
        }
      }
    }),
    prisma.profile.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 4,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        ...whereQuery,
        bridge_institutes: {
          some: {
            institute: {
              id: req.query.id as string
            }
          }
        }
      },
      include: {
        user: true,
        bridge_institutes: true
      }
    })
  ])

  data = data.sort((a, b) => (
    a.bridge_institutes.filter((i) => i.institute_id === req.query.id)[0].role_title.localeCompare(
      b.bridge_institutes.filter((i) => i.institute_id === req.query.id)[0].role_title
    )
  ))

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_staff'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }
  
  const body = JSON.parse(req.body) as Partial<Profile & ProfileToInstituteBridge>

  if (!cleanString(body.email)) {
    return res.status(400).json({ error: 'Email is required!' })
  }

  if (!cleanString(body.role_title)) {
    return res.status(400).json({ error: 'Role is required!' })
  }

  if (!body.start_date) {
    return res.status(400).json({ error: 'Start Date is required!' })
  }

  const profile = await prisma.profile.findUnique({
    where: {
      email: body.email
    }
  })

  if (!profile) {
    return res.status(400).json({ error: 'Profile not found!' })
  }
  
  const bridge = await prisma.profileToInstituteBridge.upsert({
    where: {
      profile_id_institute_id: {
        profile_id: profile.id,
        institute_id: req.query.id as string
      }
    },
    update: {
      role_title: body.role_title,
      start_date: handleDate(body.start_date),
      end_date: handleDate(body.end_date) ?? undefined,
      is_head: body.is_head ?? false
    },
    create: {
      profile: {
        connect: {
          id: profile.id
        }
      },
      institute: {
        connect: {
          id: req.query.id as string
        }
      },
      role_title: body.role_title,
      start_date: handleDate(body.start_date),
      end_date: handleDate(body.end_date) ?? undefined,
      is_head: body.is_head ?? false
    }
  })

  return res.status(200).json({ success: true, data: bridge })
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_staff'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }
  
  const body = JSON.parse(req.body) as Partial<Profile & ProfileToInstituteBridge>

  if (!cleanString(body.email)) {
    return res.status(400).json({ error: 'Email is required!' })
  }

  const profile = await prisma.profile.findUnique({
    where: {
      email: body.email
    }
  })

  if (!profile) {
    return res.status(400).json({ error: 'Profile not found!' })
  }
  
  const bridge = await prisma.profileToInstituteBridge.delete({
    where: {
      profile_id_institute_id: {
        profile_id: profile.id,
        institute_id: req.query.id as string
      }
    }
  })

  return res.status(200).json({ success: true, data: bridge })
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