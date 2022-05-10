import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from '../../../lib/server/prisma'
import checkDiskSpace from 'check-disk-space'
import path from 'path'

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

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