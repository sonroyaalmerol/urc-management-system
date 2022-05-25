import { prisma } from "../../../../lib/server/prisma"
import injector from "../../../../lib/client/injectors/collection_api"

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await injector(req, res, async ({ skip, take, where, orderBy }) => {
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
        },
        orderBy
      })
    ])
  })
}