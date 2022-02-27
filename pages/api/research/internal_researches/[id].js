import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { id } = req.query
  
  const research = await prisma.uRCFundedResearch.findFirst({ 
    where: {
      id
    },
    include: {
      bridge_units: {
        include: {
          unit: true
        }
      },
      bridge_users: {
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