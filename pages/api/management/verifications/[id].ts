import { prisma } from '../../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import handleError from '../../../../utils/server/handleError'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'
import { roleChecker } from '../../../../utils/roleChecker'
import verifyRequest from '../../../../utils/server/verifyRequest'

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, ['urc_chairperson', 'urc_staff'])) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const body = JSON.parse(req.body) as { verified: boolean }
  const { id } = req.query
  
  if (body.verified === null || body.verified === undefined) {
    return res.status(400).json({ error: 'State is required!' })
  }

  await verifyRequest(id as string, body.verified, session.profile.id)

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