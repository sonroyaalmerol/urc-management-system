import prisma from "../../../../lib/prisma-client"
import injector from "../../../../lib/injectors/collection_api"

export default async function handler(req, res) {
  await injector(req, res, async ({ skip, take, where }) => {
    return await prisma.$transaction([
      prisma.user.count({
        where: {
          ...where,
          bridge_roles: {
            some: {
              user_role: {
                id: 'researcher'
              }
            }
          }
        }
      }),
      prisma.user.findMany({
        skip,
        take,
        where: {
          ...where,
          bridge_roles: {
            some: {
              user_role: {
                id: 'researcher'
              }
            }
          },
        }
      })
    ])
  })
}