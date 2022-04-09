import prisma from "../../../../lib/prisma-client"
import injector from "../../../../lib/injectors/collection_api"

export default async function handler(req, res) {
  await injector(req, res, async ({ skip, take, where }) => {
    return await prisma.$transaction([
      prisma.download.count({
        where
      }),
      prisma.download.findMany({
        skip,
        take,
        where
      })
    ])
  })
}