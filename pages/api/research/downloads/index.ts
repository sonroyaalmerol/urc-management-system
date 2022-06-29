import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where, orderBy }) => {
    return await prisma.$transaction([
      prisma.download.count({
        where: {
          ...where
        }
      }),
      prisma.download.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          category: true
        }
      })
    ])
  }, 'downloads')
}