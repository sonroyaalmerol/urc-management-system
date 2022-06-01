import { prisma } from '../../../lib/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import handleError from '../../../lib/server/handleError'
import { Unit } from '@prisma/client'
import cleanString from '../../../lib/cleanString'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  let [totalCount, tmpData] = await prisma.$transaction([
    prisma.unit.count({
      where: {
        parent_unit: {
          isNot: null
        }
      },
    }),
    prisma.unit.findMany({
      where: {
        parent_unit: {
          isNot: null
        }
      },
      include: {
        parent_unit: true
      }
    })
  ])

  const data: { parent_name: string, parent_id: string, units: Unit[] }[] = []

  tmpData.forEach(unit => {
    const index = data.findIndex((u) => unit.parent_unit.id === u.parent_id)
    if (index === -1) {
      data.push({
        parent_name: unit.parent_unit.name,
        parent_id: unit.parent_unit.id,
        units: [
          unit
        ]
      })
    } else {
      data[index].units.push(unit)
    }
  })

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<Unit>

  if (!cleanString(body.name)) {
    return res.status(400).json({ error: 'Name is required!' })
  }

  let unit: Unit

  if (body.id) {
    unit = await prisma.unit.update({
      where: {
        id: body.id
      },
      data: {
        name: body.name,
      }
    })
  } else {
    unit = await prisma.unit.create({
      data: {
        name: body.name,
        parent_unit: body.parent_unit_id ? {
          connect: {
            id: body.parent_unit_id
          }
        } : undefined
      }
    })
  }

  return res.status(200).json({ success: true, data: unit })
}

const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const body = JSON.parse(req.body) as Partial<Unit>

  if (!cleanString(body.id)) {
    return res.status(400).json({ error: 'Unit is required!' })
  }

  const unit = await prisma.unit.delete({
    where: {
      id: body.id
    }
  })

  return res.status(200).json({ success: true, data: unit })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  return await handleError(async () => {
    if (req.method === 'POST') {
      return await postHandler(req, res, session);
    }
  
    if (req.method === 'GET') {
      return await getHandler(req, res, session)
    }

    if (req.method === 'DELETE') {
      return await deleteHandler(req, res, session)
    }
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}