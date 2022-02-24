import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const { id } = req.query
  const prisma = new PrismaClient()

  const news = await prisma.instituteNews.findFirst({
    where: {
      id
    }
  })

  if (news) {
    res.status(200).json(news)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}