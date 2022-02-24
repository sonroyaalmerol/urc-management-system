import prisma from "../../../../prisma/client"

export default async function handler(req, res) {
  
  
  const institutes = await prisma.institute.findMany()

  res.status(200).json(institutes)
}