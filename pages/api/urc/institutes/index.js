import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const prisma = new PrismaClient()
  
  const institutes = await prisma.institute.findMany()

  res.status(200).json(institutes)
}