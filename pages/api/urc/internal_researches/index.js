import prisma from "../../../../prisma/client"

export default async function handler(req, res) {
  

  const internalResearches = await prisma.uRCFundedResearch.findMany({ include: {
    users_to_urc_funded_researches: {
      include: {
        users: true
      }
    }
  } })
  
  res.status(200).json(internalResearches)
}