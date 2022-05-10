import { prisma } from "../../../../lib/server/prisma"
import injector from "../../../../lib/client/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where }) => {
    return await prisma.$transaction([
      prisma.project.count({
        where: {
          ...where,
          approved: true
        }
      }),
      prisma.project.findMany({
        skip,
        take,
        include: {
          units: {
            include: {
              parent_unit: true
            }
          },
          bridge_users: {
            include: {
              user: true
            }
          }
        },
        where: {
          ...where,
          approved: true
        }
      })
    ])
  })
}