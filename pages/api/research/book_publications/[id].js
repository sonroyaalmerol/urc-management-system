import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { id } = req.query
  
  const publications = await prisma.bookPublication.findFirst({
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

  if (publications) {
    res.status(200).json(publications)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}