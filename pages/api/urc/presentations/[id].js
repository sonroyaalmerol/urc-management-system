import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const { id } = req.query
  const prisma = new PrismaClient()

  const presentations = await prisma.researchPresentation.findFirst({
    where: {
      id
    }
  })

  if (presentations) {
    res.status(200).json(presentations)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}