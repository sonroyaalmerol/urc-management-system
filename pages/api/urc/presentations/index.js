import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const prisma = new PrismaClient()
  
  const presentations = await prisma.researchPresentation.findMany()

  res.status(200).json(presentations)
}