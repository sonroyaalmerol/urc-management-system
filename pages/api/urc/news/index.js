import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const prisma = new PrismaClient()
  
  const news = await prisma.instituteNews.findMany()

  res.status(200).json(news)
}