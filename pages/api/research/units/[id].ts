import { prisma } from "../../../../utils/server/prisma"
import injector from "../../../../utils/client/injectors/individual_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ where }) => {
    return await prisma.unit.findFirst({
      where: {
        ...where.OR[0]
      },
      include: {
        parent_unit: true,
        sub_units: true
      }
    })
  }, 'units')
}