import prisma from "../../../../lib/prisma-client"
import injector from "../../../../lib/injectors/collection_api"

export default async function handler(req, res) {
  await injector(req, res, async ({ skip, take, where: injected_where }) => {
    return await prisma.$transaction([
      prisma.user.count({
        where: {
          ...injected_where,
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
          ...injected_where,
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