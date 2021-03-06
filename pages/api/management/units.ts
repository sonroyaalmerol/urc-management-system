import { prisma } from '../../../utils/server/prisma'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Session } from 'next-auth'

import handleError from '../../../utils/server/handleError'
import { Unit } from '@prisma/client'
import cleanString from '../../../utils/cleanString'
import { roleChecker } from '../../../utils/roleChecker'
import { SETTING_UNITS } from '../../../utils/permissions'

const getHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  let [totalCount, tmpData] = await prisma.$transaction([
    prisma.unit.count(),
    prisma.unit.findMany({
      where: {
        parent_unit: {
          is: null
        }
      },
      include: {
        sub_units: true
      },
      orderBy: {
        name: 'asc'
      }
    })
  ])

  const data: { parent_name: string, parent_id: string, units: Unit[] }[] = tmpData.map(unit => ({
    parent_name: unit.name,
    parent_id: unit.id,
    units: unit.sub_units
  }))

  return res.status(200).json({
    totalCount,
    data
  })
}

const postHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  if (!roleChecker(session.profile, SETTING_UNITS)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

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
  if (!roleChecker(session.profile, SETTING_UNITS)) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

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