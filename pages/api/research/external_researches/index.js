import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { page, per_page } = req.query

  const [count, externalResearches] = await prisma.$transaction([
    prisma.externalResearch.count(),
    prisma.externalResearch.findMany({
      skip: (per_page ?? 10) * page ? (page - 1) : 0,
      take: (per_page ?? 10),
      include: {
        users_to_external_researches: {
          include: {
            user: true
          }
        }
      } 
    })
  ])

  res.status(200).json({
    data: externalResearches,
    page: page ?? 1,
    per_page: per_page ?? 10,
    total_pages: Math.ceil(count / (per_page ?? 10))
  })
}