import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { page, per_page } = req.query
  
  const [count, presentations] = await prisma.$transaction([
    prisma.researchPresentation.count(),
    prisma.researchPresentation.findMany({
      skip: (per_page ?? 10) * page ? (page - 1) : 0,
      take: (per_page ?? 10),
    })
  ])

  res.status(200).json({
    data: presentations,
    page: page ?? 1,
    per_page: per_page ?? 10,
    total_pages: Math.ceil(count / (per_page ?? 10))
  })
}