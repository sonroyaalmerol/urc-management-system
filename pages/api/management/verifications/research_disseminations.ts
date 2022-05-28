import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'
import slugGenerator from '../../../../lib/slugGenerator'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Project, ResearchDissemination, VerificationRequest } from '@prisma/client'

import relevancy from 'relevancy'
import roleChecker from '../../../../lib/roleChecker'

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
    prisma.researchDissemination.count({
      where: {
        title: {
          not: ''
        },
        ...whereQuery
      }
    }),
    prisma.researchDissemination.findMany({
      skip: req.query.cursor ? 1 : undefined,
      take: 5,
      cursor: req.query.cursor ? {
        id: req.query.cursor as string
      } : undefined,
      where: {
        title: {
          not: ''
        },
        ...whereQuery
      },
      select: {
        id: true,
        title: true
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
    ResearchDissemination & VerificationRequest
  >

  if (!body.title) {
    return res.status(400).json({ error: 'Title is required!' })
  }

  if (!body.role) {
    return res.status(400).json({ error: 'Role is required!' })
  }

  let currentEntry = await prisma.researchDissemination.findUnique({
    where: {
      title: body.title
    }
  })

  if (!currentEntry) {
    if (!body.organization) {
      return res.status(400).json({ error: 'Organization is required!' })
    }

    if (!body.location) {
      return res.status(400).json({ error: 'Location is required!' })
    }

    if (!body.event_date) {
      return res.status(400).json({ error: 'Event Date is required!' })
    }

    currentEntry = await prisma.researchDissemination.create({
      data: {
        title: body.title,
        organization: body.organization,
        location: body.location,
        event_date: body.event_date,
        url: body.url
      }
    })
  }

  const verificationRequest = await prisma.verificationRequest.create({
    data: {
      profile: {
        connect: {
          id: session.profile.id
        }
      },
      role: body.role,
      type: 'RESEARCH_DISSEMINATION',
      description: body.description,
      research_dissemination: {
        connect: {
          id: currentEntry.id
        }
      }
    }
  })

  return res.status(200).json({ success: true, data: verificationRequest })
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