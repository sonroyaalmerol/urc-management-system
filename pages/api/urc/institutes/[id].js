import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const { id } = req.query
  const prisma = new PrismaClient()

  const institute = await prisma.institute.findFirst({
    where: {
      id
    }
  })

  if (institute) {
    res.status(200).json(institute)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}