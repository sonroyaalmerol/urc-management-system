import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/individual_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ where }) => {
    return await prisma.user.findFirst({
      where: {
        ...where.OR[0],
        profile: {
          roles: {
            some: {
              id: 'researcher'
            }
          }
        }
      }
    })
  }, 'researchers')
}