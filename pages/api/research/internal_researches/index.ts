import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where, orderBy }) => {
    return await prisma.$transaction([
      prisma.project.count({
        where: {
          ...where,
          project_status_id: 'finished'
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
          research_areas: true,
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
          project_status_id: 'finished'
        },
        orderBy
      })
    ])
  }, 'internal_researches')
}