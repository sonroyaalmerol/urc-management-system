import { prisma } from "../../../../lib/server/prisma"
import injector from "../../../../lib/client/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where }) : Promise<any[]> => {
    return await prisma.$transaction([
      prisma.bookPublication.count({
        where: {
          ...where,
          verified: true
        }
      }),
      prisma.bookPublication.findMany({
        skip,
        take,
        include: {
          bridge_users: {
            include: {
              user: true
            }
          },
          units: {
            include: {
              parent_unit: true
            }
          }
        },
        where: {
          ...where,
          verified: true
        }
      })
    ])
  })
}