import { parse } from 'date-fns';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Function } from '../../../types/api';
import { prisma } from '../../server/prisma'

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
  'units' |
  'download_categories'
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

const injectFullname = (search: string) => {
  const ORarray = []

  search.split(' ').forEach((word) => {
    ORarray.push({
      first_name: {
        mode: 'insensitive',
        contains: word
      }
    })
    ORarray.push({
      middle_initial: {
        mode: 'insensitive',
        contains: word
      }
    })
    ORarray.push({
      last_name: {
        mode: 'insensitive',
        contains: word
      }
    })
    ORarray.push({
      honorific: {
        mode: 'insensitive',
        contains: word
      }
    })
    ORarray.push({
      titles: {
        mode: 'insensitive',
        contains: word
      }
    })
  })

  return ORarray
}

const injectAuthors = async (search: string, type: CollectionTypes) => {
  let ORarray = []
  const defaultCase = () => {
    search.split(' ').forEach((word) => {
      ORarray.push({
        bridge_profiles: {
          some: {
            profile: {
              id: word
            }
          }
        }
      })
      ORarray.push({
        bridge_profiles: {
          some: {
            profile: {
              email: {
                mode: 'insensitive',
                contains: word
              }
            }
          }
        }
      })
      ORarray.push({
        bridge_profiles: {
          some: {
            profile: {
              first_name: {
                mode: 'insensitive',
                contains: word
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
                contains: word
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
                contains: word
              }
            }
          }
        }
      })
    })
  }
  const wildcardSearch = `%${search}%`
  switch (type) {
    case 'book_publications':
      const bookIds: { id: string }[] = await prisma.$queryRaw`
        select id from public."BookPublication" where lower(array_to_string(authors, ', ')) like lower(${wildcardSearch})
      `
      ORarray = [...ORarray, ...bookIds.map((id) => (
        { id: id.id }
      ))]

      defaultCase()
      break
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
      const externalIds: { id: string }[] = await prisma.$queryRaw`
        select id from public."ExternalResearch" where lower(array_to_string(main_proponents , ', ')) like lower(${wildcardSearch}) or lower(array_to_string(co_proponents, ', ')) like lower(${wildcardSearch});
      `
      ORarray = [...ORarray, ...externalIds.map((id) => (
        { id: id.id }
      ))]
      defaultCase()
      break
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
      } else if (i === 'authors' || i === 'presentors' || i === 'users') {
        ORarray = [...ORarray, ...await injectAuthors(search as string, type)]
      } else if (i === 'fullname') {
        ORarray = [...ORarray, ...injectFullname(search as string)]
      } else if (i === 'categories') {
        ORarray.push({
          categories: {
            some: {
              id: search
            }
          }
        })
        ORarray.push({
          categories: {
            some: {
              title: {
                mode: 'insensitive',
                contains: search
              }
            }
          }
        })
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
    const from = parse(createdRange[0].trim(), 'yyyy-MM-dd', baseDateFrom)
    const to = parse(createdRange[1].trim(), 'yyyy-MM-dd', baseDateTo)

    ANDarray.push({
      created_at: {
        gte: from,
        lte: to
      }
    })
  }

  if (updated_range) {
    const createdRange = (created_range as string).split(',')
    const from = parse(createdRange[0].trim(), 'yyyy-MM-dd', baseDateFrom)
    const to = parse(createdRange[1].trim(), 'yyyy-MM-dd', baseDateTo)

    ANDarray.push({
      updated_at: {
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