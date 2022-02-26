import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { id } = req.query

  const research = await prisma.externalResearch.findFirst({ 
    where: {
      id
    },
    include: {
      users_to_external_researches: {
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