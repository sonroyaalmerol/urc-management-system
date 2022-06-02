import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../utils/server/prisma'
import checkDiskSpace from 'check-disk-space'
import path from 'path'
import formatBytes from '../../../utils/formatBytes'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
  
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Authentication required.' })
  }

  try {
    const storageUsed = await prisma.fileUpload.aggregate({
      _sum: {
        size: true
      }
    })

    const storageInfo = await checkDiskSpace(
      path.join(process.cwd(), '/storage')
    )

    return res.status(200).json({
      formatted: {
        used: formatBytes(storageUsed._sum.size),
        free: formatBytes(storageInfo.free),
        totalSize: formatBytes(storageUsed._sum.size + storageInfo.free)
      },
      used: storageUsed._sum.size,
      free: storageInfo.free,
      totalSize: storageUsed._sum.size + storageInfo.free
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}