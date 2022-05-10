import type { prisma } from '../lib/server/prisma'

type PrismaAction = (
  'aggregate' |
  'count' |
  'create' |
  'createMany' |
  'delete' |
  'deleteMany' |
  'findFirst' |
  'findMany' |
  'findUnique' |
  'groupBy' |
  'update' |
  'updateMany' |
  'upsert'
)

type PrismaModel = keyof (typeof prisma)

interface PrismaBody { 
  model: PrismaModel
  action: PrismaAction
  args?: any 
}

export {
  PrismaAction,
  PrismaModel,
  PrismaBody
}