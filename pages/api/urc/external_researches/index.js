import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { page } = req.query
  const externalResearches = await prisma.externalResearch.findMany({
    skip: 10 * page ? (page - 1) : 0,
    take: 10,
    include: {
      users_to_external_researches: {
        include: {
          users: true
        }
      }
    } 
  })

  res.status(200).json(externalResearches)
}