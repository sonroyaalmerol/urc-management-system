import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where, orderBy }) : Promise<any[]> => {
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
          bridge_profiles: {
            include: {
              profile: {
                include: {
                  user: true
                }
              }
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
        },
        orderBy
      })
    ])
  }, 'book_publications')
}