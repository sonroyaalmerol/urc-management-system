import { prisma } from '../../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id } = req.query

  const data = await prisma.profile.findUnique({
    where: {
      id: id as string
    },
    include: {
      user: true,
      units: true,
      bridge_institutes: {
        include: {
          institute: true
        }
      },
      bridge_projects: {
        include: {
          project: true
        }
      },
      bridge_external_researches: {
        include: {
          external_research: true
        }
      },
      bridge_journal_publications: {
        include: {
          journal_publication: true
        }
      },
      bridge_book_publications: {
        include: {
          book_publication: true
        }
      },
      bridge_research_disseminations: {
        include: {
          research_dissemination: true
        }
      },
      bridge_research_presentations: {
        include: {
          research_presentation: true
        }
      }
    }
  })


  return res.status(200).json({
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {

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