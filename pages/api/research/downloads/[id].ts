import { prisma } from "../../../../lib/server/prisma"
import injector from "../../../../lib/client/injectors/individual_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ where }) => {
    return await prisma.download.findFirst({ 
      where: {
        ...where.OR[0]
      }
    })
  })
}