import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { page, per_page } = req.query

  const [count, downloads] = await prisma.$transaction([
    prisma.download.count(),
    prisma.download.findMany({
      skip: (per_page ?? 10) * page ? (page - 1) : 0,
      take: (per_page ?? 10),
    })
  ])

  res.status(200).json({
    data: downloads,
    page: page ?? 1,
    per_page: per_page ?? 10,
    total_pages: Math.ceil(count / (per_page ?? 10))
  })
}