import { prisma } from "../../../../lib/prisma-client"
import injector from "../../../../lib/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where }) => {
    return await prisma.$transaction([
      prisma.user.count({
        where: {
          ...where,
          roles: {
            some: {
              id: 'researcher'
            }
          }
        }
      }),
      prisma.user.findMany({
        skip,
        take,
        where: {
          ...where,
          roles: {
            some: {
              id: 'researcher'
            }
          }
        }
      })
    ])
  })
}