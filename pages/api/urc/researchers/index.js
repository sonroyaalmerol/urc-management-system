import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { page } = req.query
  const researchers = await prisma.user.findMany({
    skip: 10 * page ? (page - 1) : 0,
    take: 10,
    where: {
      users_to_roles: {
        some: {
          user_roles: {
            id: 'researcher'
          }
        }
      }
    }
  })

  res.status(200).json(researchers)
}