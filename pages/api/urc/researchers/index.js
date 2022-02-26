import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const researchers = await prisma.user.findMany({
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