import { prisma } from '../../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Institute } from '@prisma/client'
import handleError from '../../../../../lib/server/handleError'

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<Institute>

  const { id } = req.query

  const institute = await prisma.institute.update({
    where: {
      id: id as string
    },
    data: {
      email: body.email,
      address: body.address,
      contact_number: body.contact_number,
      research_areas: body.research_areas,
      short_name: body.short_name,
      name: body.name,
      description: body.description
    }
  })

  return res.status(200).json({ success: true, data: institute })
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