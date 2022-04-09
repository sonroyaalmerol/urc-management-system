import prisma from "../../../../lib/prisma-client"
import injector from "../../../../lib/injectors/collection_api"

export default async function handler(req, res) {
  await injector(req, res, async ({ skip, take, where }) => {
    return await prisma.$transaction([
      prisma.uRCFundedResearch.count({
        where
      }),
      prisma.uRCFundedResearch.findMany({
        skip,
        take,
        include: {
          bridge_units: {
            include: {
              unit: true
            }
          },
          bridge_users: {
            include: {
              user: true
            }
          }
        },
        where
      })
    ])
  })
}