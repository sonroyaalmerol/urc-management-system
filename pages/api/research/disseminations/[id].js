import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  const { id } = req.query
  
  const disseminations = await prisma.researchDissemination.findFirst({
    where: {
      id
    }
  })

  if (disseminations) {
    res.status(200).json(disseminations)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}