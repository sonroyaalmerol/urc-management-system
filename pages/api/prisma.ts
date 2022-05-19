import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../lib/server/prisma'

import type {
  PrismaBody,
  PrismaModel,
  PrismaAction
} from '../../types/client-prisma'

const PERMISSIONS: { [K in PrismaModel]?: { [K in PrismaAction]?: boolean } } = {
  instituteNews: {
    findMany: true
  },
  project: {
    findMany: true
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` })
  }

  const { model, action, args }: PrismaBody = JSON.parse(req.body)

  const session = await getSession({ req })

  if (!session) {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  if (!Object.keys(PERMISSIONS).includes(model)) {
    return res.status(401).json({ error: 'Model is private!' })
  }

  if (!PERMISSIONS[model][action]) {
    return res.status(401).json({ error: 'Action is forbidden!' })
  }

  try {
    const response = await prisma[model][action](args)

    return res.status(200).json(response)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}