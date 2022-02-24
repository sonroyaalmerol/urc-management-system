import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const prisma = new PrismaClient()

  const internalResearches = await prisma.uRCFundedResearch.findMany({ include: {
    users_to_urc_funded_researches: {
      include: {
        users: true
      }
    }
  } })
  
  res.status(200).json(internalResearches)
}