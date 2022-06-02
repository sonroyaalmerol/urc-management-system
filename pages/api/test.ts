import { prisma } from '../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  /* await prisma.instituteNews.updateMany({
    where: {
      institute_id: null
    },
    data: {
      institute_id: 'cl3p7sntw00861kini3ov0y1i',
      verified: true
    }
  })
  //*/
  return res.status(200).json({ success: true })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  if (req.method === 'GET') {
    return await getHandler(req, res, session)
  }

  return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
}