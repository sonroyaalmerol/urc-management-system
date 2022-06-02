import { prisma } from '../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Profile } from '@prisma/client'
import handleError from '../../../../utils/server/handleError'

import relevancy from 'relevancy'
import { roleChecker } from '../../../../utils/roleChecker'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { unit } = req.query

  const searchQuery = (req.query?.query as string) ?? ''

  const queryFilter = searchQuery.split(' ').filter(s => s.trim().length > 0)
  const queryFields = [
    'email', 'first_name', 'middle_initial', 'last_name', 'honorific', 'titles'
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

  let whereQuery: any = searchQuery.trim().length > 0 ? {
    OR: orQuery
  } : undefined

  if (req.query.proponents_only === 'true') {
    whereQuery = { ...whereQuery,
      bridge_projects: {
        some: {
          project: {
            id: req.query.project_id
          }
        }
      }
    }
  }

  let [totalCount, data] = await prisma.$transaction([
    prisma.profile.count({
      where: {
        ...whereQuery,
        units: unit ? {
          some: {
            id: unit
          }
        } : undefined
      }
    }),
    prisma.profile.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 10,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        ...whereQuery,
        units: unit ? {
          some: {
            id: unit
          }
        } : undefined
      },
      include: {
        user: true
      },
      orderBy: [
        {
          last_name: 'asc'
        },
        {
          email: 'asc'
        }
      ]
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
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_staff'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as Partial<Profile>

  if (!body.email) {
    return res.status(400).json({ error: 'Email is required!' })
  }

  if (!body.first_name) {
    return res.status(400).json({ error: 'First Name is required!' })
  }

  if (!body.middle_initial) {
    return res.status(400).json({ error: 'Middle Initial is required!' })
  }

  if (!body.last_name) {
    return res.status(400).json({ error: 'Last Name is required!' })
  }

  if (!body.email.includes('@addu.edu.ph')) {
    return res.status(400).json({ error: 'AdDU email is required!' })
  }

  const profile = await prisma.profile.create({
    data: {
      email: body.email,
      first_name: body.first_name,
      middle_initial: body.middle_initial,
      last_name: body.last_name
    }
  })

  return res.status(200).json({ success: true, data: profile })
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