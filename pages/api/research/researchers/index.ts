import { prisma } from "../../../../lib/server/prisma"
import injector from "../../../../lib/client/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where, orderBy }) => {
    return await prisma.$transaction([
      prisma.profile.count({
        where: {
          ...where,
          roles: {
            some: {
              id: 'researcher'
            }
          }
        }
      }),
      prisma.profile.findMany({
        skip,
        take,
        where: {
          ...where,
          roles: {
            some: {
              id: 'researcher'
            }
          }
        },
        include: {
          user: true
        },
        orderBy
      })
    ])
  })
}