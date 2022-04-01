import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { short_name } = req.query

  const institute = await prisma.institute.findFirst({
    where: {
      short_name
    },
    include: {
      bridge_users: {
        include: {
          user: true
        }
      }
    }
  })

  if (institute) {
    res.status(200).json(institute)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}