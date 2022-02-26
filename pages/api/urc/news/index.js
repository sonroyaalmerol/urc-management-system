import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const news = await prisma.instituteNews.findMany()

  res.status(200).json(news)
}