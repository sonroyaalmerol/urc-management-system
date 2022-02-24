import { PrismaClient } from "@prisma/client"

export default async function handler(req, res) {
  const { id } = req.query
  const prisma = new PrismaClient()

  const research = await prisma.uRCFundedResearch.findFirst({ 
    where: {
      id
    },
    include: {
      users_to_urc_funded_researches: {
        include: {
          users: true
        }
      }
    } 
  })

  if (research) {
    res.status(200).json(research)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}