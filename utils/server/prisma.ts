import { PrismaClient } from '@prisma/client'
import slugGenerator from '../slugGenerator'

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: [
      {
        emit: 'event',
        level: 'query'
      }
    ]
  })

  prisma.$use(async (params, next) => {
    // Manipulate params here
    const manipulatedParams = Object.assign({}, params)
    const AUDIT_ACTIONS = [
      'create',
      'createMany',
      'delete',
      'deleteMany',
      'update',
      'updateMany',
      'upsert'
    ]
    if (AUDIT_ACTIONS.includes(params.action) && params.model !== 'Audit') {
      await prisma.audit.create({
        data: {
          table_name: params.model,
          action: params.action,
          args: JSON.stringify(params.args)
        }
      })

      // add slug
      const SLUGIFY_MODELS = [
        'ExternalResearch',
        'InstituteNews',
        'ResearchPresentation',
        'ResearchDissemination',
        'JournalPublication',
        'BookPublication',
        'URCFundedResearch'
      ]
      if (SLUGIFY_MODELS.includes(params.model)) {
        if (params.action === 'create') {
          if (!params.args.data.slug && params.args.data.title) {
            manipulatedParams.args.data.slug = slugGenerator(params.args.data.title)
          }
        } else if (params.action === 'upsert') {
          if (!params.args.create.slug && params.args.create.title) {
            manipulatedParams.args.create.slug = slugGenerator(params.args.create.title)
          }
        }
      }

    }
    const result = await next(manipulatedParams)
    // See results here
    return result
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma