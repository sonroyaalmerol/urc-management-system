import { prisma } from "../../../../lib/server/prisma"
import injector from "../../../../lib/client/injectors/collection_api"

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
          bridge_profiles: {
            include: {
              profile: {
                include: {
                  user: true
                }
              }
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