import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where, orderBy }) => {
    return await prisma.$transaction([
      prisma.instituteNews.count({
        where: {
          ...where,
          verified: true
        }
      }),
      prisma.instituteNews.findMany({
        skip,
        take,
        where: {
          ...where,
          verified: true
        },
        include: {
          uploads: true,
          institute: true
        },
        orderBy
      })
    ])
  }, 'news')
}