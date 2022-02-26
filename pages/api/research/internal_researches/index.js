import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { page, per_page } = req.query

  const [count, internalResearches] = await prisma.$transaction([
    prisma.uRCFundedResearch.count(),
    prisma.uRCFundedResearch.findMany({
      skip: (per_page ?? 10) * page ? (page - 1) : 0,
      take: (per_page ?? 10),
      include: {
        urc_funded_research_to_unit: {
          include: {
            unit: true
          }
        },
        users_to_urc_funded_researches: {
          include: {
            user: true
          }
        }
      },
    })
  ])
  
  res.status(200).json({
    data: internalResearches,
    page: page ?? 1,
    per_page: per_page ?? 10,
    total_pages: Math.ceil(count / (per_page ?? 10))
  })
}