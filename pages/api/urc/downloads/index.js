import prisma from "../../../../prisma/client"

export default async function handler(req, res) {
  

  const downloads = await prisma.download.findMany()

  res.status(200).json(downloads)
}