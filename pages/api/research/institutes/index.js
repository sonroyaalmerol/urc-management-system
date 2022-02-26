import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  let { page, per_page } = req.query
  page = page ? parseInt(page) : 1
  per_page = per_page ? parseInt(per_page) : 10

  if (per_page < 1) {
    res.status(400).json({
      error: 'Invalid per_page value.',
      page,
      per_page,
      total_pages: -1
    })
    return;
  }

  const [count, institutes] = await prisma.$transaction([
    prisma.institute.count(),
    prisma.institute.findMany({
      skip: (per_page ?? 10) * page ? (page - 1) : 0,
      take: (per_page ?? 10),
    })
  ])

  const total_pages = Math.ceil(count / per_page)
  if (page > total_pages || page < 1) {
    res.status(400).json({
      error: 'Invalid page value.',
      page,
      per_page,
      total_pages
    })
    return;
  }

  res.status(200).json({
    data: institutes,
    page,
    per_page,
    total_pages
  })
}