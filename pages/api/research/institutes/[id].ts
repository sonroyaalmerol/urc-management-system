import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/individual_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ where }) => {
    return await prisma.institute.findFirst({
      where: {
        short_name: where.OR[0].id
      },
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
        research_areas: true
      }
    })
  }, 'institutes')
}