import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/individual_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ where }) => {
    return await prisma.profile.findFirst({
      where: {
        ...where.OR[0],
        roles: {
          some: {
            id: 'researcher'
          }
        }
      },
      include: {
        user: true,
        research_areas: true,
        units: true
      },
    })
  }, 'researchers')
}