import { prisma } from "../../../../lib/prisma-client"
import injector from "../../../../lib/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where }) => {
    return await prisma.$transaction([
      prisma.externalResearch.count({
        where: {
          ...where,
          verified: true
        }
      }),
      prisma.externalResearch.findMany({
        skip,
        take,
        include: {
          bridge_users: {
            include: {
              user: true
            }
          },
        },
        where: {
          ...where,
          verified: true
        }
      })
    ])
  })
}