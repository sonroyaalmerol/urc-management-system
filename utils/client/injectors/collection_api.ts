import { parse } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Function } from '../../../types/api';

type CollectionTypes = (
  'book_publications' |
  'disseminations' |
  'downloads' |
  'external_researches' |
  'institutes' |
  'internal_researches' |
  'journal_publications' |
  'news' |
  'presentations' |
  'researchers' |
  'units'
)

const injectUnits = (search: string) => {
  const ORarray = []
  ORarray.push({
    units: {
      some: {
        name: {
          mode: 'insensitive',
          contains: search
        },
      }
    }
  })
  ORarray.push({
    units: {
      some: {
        id: {
          mode: 'insensitive',
          contains: search
        },
      }
    }
  })
  ORarray.push({
    units: {
      some: {
        parent_unit: {
          name: {
            mode: 'insensitive',
            contains: search
          }
        },
      }
    }
  })
  ORarray.push({
    units: {
      some: {
        parent_unit: {
          id: {
            mode: 'insensitive',
            contains: search
          }
        },
      }
    }
  })

  return ORarray
}

const injectAuthors = async (search: string, type: CollectionTypes) => {
  let ORarray = []
  const defaultCase = () => {
    ORarray.push({
      bridge_profiles: {
        some: {
          profile: {
            first_name: {
              mode: 'insensitive',
              contains: search
            }
          }
        }
      }
    })
    ORarray.push({
      bridge_profiles: {
        some: {
          profile: {
            last_name: {
              mode: 'insensitive',
              contains: search
            }
          }
        }
      }
    })
    ORarray.push({
      bridge_profiles: {
        some: {
          profile: {
            middle_initial: {
              mode: 'insensitive',
              contains: search
            }
          }
        }
      }
    })
  }
  const wildcardSearch = `%${search}%`
  switch (type) {
    case 'book_publications':
    case 'journal_publications':
      const journalIds: { id: string }[] = await prisma.$queryRaw`
        select id from public."JournalPublication" where lower(array_to_string(authors, ', ')) like lower(${wildcardSearch})
      `
      ORarray = [...ORarray, ...journalIds.map((id) => (
        { id: id.id }
      ))]

      defaultCase()
      break
    case 'external_researches':
    case 'internal_researches':
      const projectIds: { id: string }[] = await prisma.$queryRaw`
        select id from public."Project" where lower(array_to_string(main_proponents , ', ')) like lower(${wildcardSearch}) or lower(array_to_string(co_proponents, ', ')) like lower(${wildcardSearch});
      `
      ORarray = [...ORarray, ...projectIds.map((id) => (
        { id: id.id }
      ))]
      defaultCase()
      break
    case 'presentations':
      const presentationIds: { id: string }[] = await prisma.$queryRaw`
        select id from public."ResearchPresentation" where lower(array_to_string(presentors , ', ')) like lower(${wildcardSearch});
      `
      ORarray = [...ORarray, ...presentationIds.map((id) => (
        { id: id.id }
      ))]
    case 'disseminations':
      defaultCase()
  }

  return ORarray
}

const injector = async (req: NextApiRequest, res: NextApiResponse, fn: Function, type: CollectionTypes) => {
  let { page: raw_page, per_page: raw_per_page, search, fields, sort_field, sort, created_range, updated_range } = req.query
  const page: number = raw_page ? parseInt(raw_page as string) : 1
  const per_page: number = raw_per_page ? parseInt(raw_per_page as string) : 10

  const returnError = (code: number, message: string) => {
    return res.status(code).json({
      error: message,
      page,
      per_page,
      total_pages: 0
    })
  }

  if (per_page < 1) {
    return returnError(400, 'Invalid per_page value.');
  }

  if (search && !fields) {
    return returnError(400, '"fields" selection required when searching.');
  }

  let count: number = 0;
  let rawData: any[] = [];
  let data: any[] = []

  let ORarray = [];
  let ANDarray = []

  if (search) {
    for await (const i of (fields as string).split(',')) {
      if(i === 'units') {
        ORarray = [...ORarray, ...injectUnits(search as string)]
      } else if (i === 'authors') {
        ORarray = [...ORarray, ...await injectAuthors(search as string, type)]
      } else {
        ORarray.push({
          [i]: {
            mode: 'insensitive',
            contains: search
          }
        })
      }
    }
  }

  const baseDateFrom = new Date()
  baseDateFrom.setHours(0, 0, 0, 0)

  const baseDateTo = new Date()
  baseDateFrom.setHours(23, 59, 59, 999)

  if (created_range) {
    const createdRange = (created_range as string).split(',')
    const from = parse(createdRange[0], 'yyyy-MM-dd', baseDateFrom)
    const to = parse(createdRange[1], 'yyyy-MM-dd', baseDateTo)

    ANDarray.push({
      created_at: {
        gte: from,
        lte: to
      }
    })
  }

  if (updated_range) {
    const createdRange = (created_range as string).split(',')
    const from = parse(createdRange[0], 'yyyy-MM-dd', baseDateFrom)
    const to = parse(createdRange[1], 'yyyy-MM-dd', baseDateTo)

    ANDarray.push({
      created_at: {
        gte: from,
        lte: to
      }
    })
  }

  const args = {
    skip: (per_page ?? 10) * (page ? (page - 1) : 0),
    take: (per_page ?? 10),
    where: {
      AND: [
        ...ANDarray,
        search ? {
          OR: ORarray
        } : undefined
      ]
    },
    orderBy: sort_field && sort ? {
      [sort_field as string]: sort
    } : undefined
  }

  try {
    [count, rawData] = await fn(args);

    data = rawData.map((entry) => {
      let processedEntry = { ...entry }
      Object.keys(processedEntry).forEach((key) => {
        if (key === 'bridge_profiles') {
          processedEntry.users = processedEntry[key].map((profileBridge) => {
            let processedUser = { ...profileBridge }
            delete processedUser?.profile
            delete processedUser?.profile_id

            let processedProfile = { ...profileBridge.profile }
            delete processedProfile?.user
  
            let userObject = profileBridge.profile.user
            delete userObject?.created_at
            delete userObject?.updated_at
            delete userObject?.first_name
            delete userObject?.last_name
            delete userObject?.image
  
            return { ...userObject, ...processedProfile, ...processedUser }
          })

          delete processedEntry[key]
        }
      })
      return processedEntry
    })
  } catch (err) {
    return returnError(500, err.message);
  }

  const total_pages = Math.ceil(count / per_page)
  if (total_pages > 0 && (page > total_pages || page < 1)) {
    return returnError(400, 'Invalid page value.');
  }

  return res.status(200).json({
    data,
    page,
    per_page,
    total_pages
  })
}

export default injector