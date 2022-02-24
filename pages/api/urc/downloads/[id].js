import prisma from "../../../../prisma/client"

export default async function handler(req, res) {
  const { id } = req.query

  const download = await prisma.download.findFirst({ 
    where: {
      id
    }
  })

  if (download) {
    res.status(200).json(download)
  } else {
    res.status(404).json({ error: 'Resource not found.' })
  }
}