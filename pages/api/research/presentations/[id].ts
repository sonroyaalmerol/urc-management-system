import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/individual_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ where }) => {
    return await prisma.researchPresentation.findFirst({
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
        units: {
          include: {
            parent_unit: true
          }
        }
      },
    })
  }, 'presentations')
}