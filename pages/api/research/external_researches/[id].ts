import { prisma } from "../../../../lib/server/prisma"
import injector from "../../../../lib/client/injectors/individual_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ where }) => {
    return await prisma.externalResearch.findFirst({ 
      where: {
        ...where,
        verified: true
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
      }
    })
  })
}