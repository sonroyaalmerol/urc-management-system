import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const publications = await prisma.journalPublication.findMany()

  res.status(200).json(publications)
}