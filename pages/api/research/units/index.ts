import { prisma } from "../../../../lib/prisma-client"
import injector from "../../../../lib/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where }) => {
    return await prisma.$transaction([
      prisma.unit.count({
        where
      }),
      prisma.unit.findMany({
        skip,
        take,
        where,
        include: {
          parent_unit: true,
          sub_units: true
        }
      })
    ])
  })
}