import prisma from "../../../../prisma/client"

export default async function handler(req, res) {
  
  
  const presentations = await prisma.researchPresentation.findMany()

  res.status(200).json(presentations)
}