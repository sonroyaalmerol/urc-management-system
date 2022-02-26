import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { page } = req.query

  const internalResearches = await prisma.uRCFundedResearch.findMany({
    skip: 10 * page ? (page - 1) : 0,
    take: 10,
    include: {
      urc_funded_research_to_unit: {
        include: {
          unit: true
        }
      },
      users_to_urc_funded_researches: {
        include: {
          users: true
        }
      }
    },
  })
  
  res.status(200).json(internalResearches)
}