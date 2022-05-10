import { prisma } from "../../../../lib/server/prisma"
import injector from "../../../../lib/client/injectors/individual_api"
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ where }) => {
    return await prisma.bookPublication.findFirst({
      where: {
        ...where,
        verified: true,
      },
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
    })
  })
}