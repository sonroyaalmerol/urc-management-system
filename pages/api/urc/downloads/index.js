import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { page } = req.query

  const downloads = await prisma.download.findMany({
    skip: 10 * page ? (page - 1) : 0,
    take: 10,
  })

  res.status(200).json(downloads)
}