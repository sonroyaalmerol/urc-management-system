import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { id } = req.query
  
  const research = await prisma.uRCFundedResearch.findFirst({ 
    where: {
      id
    },
    include: {
      users_to_urc_funded_researches: {
        include: {
          user: true
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