import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/individual_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ where }) => {
    return await prisma.project.findFirst({ 
      where: {
        ...where,
        approved: true
      },
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
      } 
    })
  }, 'internal_researches')
}