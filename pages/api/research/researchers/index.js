import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { page, per_page } = req.query

  const [count, researchers] = await prisma.$transaction([
    prisma.user.count({
      where: {
        users_to_roles: {
          some: {
            user_role: {
              id: 'researcher'
            }
          }
        }
      }
    }),
    prisma.user.findMany({
      skip: (per_page ?? 10) * page ? (page - 1) : 0,
      take: (per_page ?? 10),
      where: {
        users_to_roles: {
          some: {
            user_role: {
              id: 'researcher'
            }
          }
        }
      }
    })
  ])

  res.status(200).json({
    data: researchers,
    page: page ?? 1,
    per_page: per_page ?? 10,
    total_pages: Math.ceil(count / (per_page ?? 10))
  })
}