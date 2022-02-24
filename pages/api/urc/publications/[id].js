import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const { id } = req.query
  const prisma = new PrismaClient()

  const publications = await prisma.journalPublication.findFirst({
    where: {
      id
    }
  })

  if (publications) {
    res.status(200).json(publications)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}