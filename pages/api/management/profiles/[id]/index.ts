import { prisma } from '../../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import type { Profile } from '@prisma/client'

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<Profile>

  const { id } = req.query

  const profile = await prisma.profile.update({
    where: {
      id: id as string
    },
    data: {
      first_name: body.first_name,
      middle_initial: body.middle_initial,
      last_name: body.last_name,
      titles: body.titles,
      honorific: body.honorific
    }
  })

  return res.status(200).json({ success: true, data: profile })
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