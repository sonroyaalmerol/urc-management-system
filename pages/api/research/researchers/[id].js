import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { id } = req.query
  
  const researcher = await prisma.user.findFirst({
    where: {
      id,
      users_to_roles: {
        some: {
          user_role: {
            id: 'researcher'
          }
        }
      }
    }
  })

  if (researcher) {
    res.status(200).json(researcher)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}