import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { id } = req.query
  
  const presentations = await prisma.researchPresentation.findFirst({
    where: {
      id
    },
    include: {
      bridge_users: {
        include: {
          user: true
        }
      }
    },
  })

  if (presentations) {
    res.status(200).json(presentations)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}