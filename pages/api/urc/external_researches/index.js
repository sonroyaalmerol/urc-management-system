import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const externalResearches = await prisma.externalResearch.findMany({ include: {
    users_to_external_researches: {
      include: {
        users: true
      }
    }
  } })

  res.status(200).json(externalResearches)
}