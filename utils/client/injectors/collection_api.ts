import { Profile, ResearchArea, Unit } from '@prisma/client';
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

const injectResearchAreas = (search: string) => {
  const ORarray = []
  ORarray.push({
    research_areas: {
      some: {
        field: {
          mode: 'insensitive',
          contains: search
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
  defaultCase()

  return ORarray
}

const injector = async (req: NextApiRequest, res: NextApiResponse, fn: Function, type: CollectionTypes) => {
  let { page: raw_page, per_page: raw_per_page, search, fields, sort_field, sort, created_range, updated_range, duration_range, event_date_range } = req.query
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
      } else if (i === 'research_areas') {
        ORarray = [...ORarray, ...injectResearchAreas(search as string)]
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
    const createdRange = (updated_range as string).split(',')
    const from = parse(createdRange[0].trim(), 'yyyy-MM-dd', baseDateFrom)
    const to = parse(createdRange[1].trim(), 'yyyy-MM-dd', baseDateTo)

    ANDarray.push({
      updated_at: {
        gte: from,
        lte: to
      }
    })
  }

  if (duration_range) {
    const createdRange = (duration_range as string).split(',')
    const from = parse(createdRange[0].trim(), 'yyyy-MM-dd', baseDateFrom)
    const to = parse(createdRange[1].trim(), 'yyyy-MM-dd', baseDateTo)

    ANDarray.push({
      duration_start: {
        gte: from,
        lte: to
      }
    })
  }

  if (event_date_range) {
    const createdRange = (event_date_range as string).split(',')
    const from = parse(createdRange[0].trim(), 'yyyy-MM-dd', baseDateFrom)
    const to = parse(createdRange[1].trim(), 'yyyy-MM-dd', baseDateTo)

    ANDarray.push({
      event_date: {
        gte: from,
        lte: to
      }
    })
  }

  const sortGenerator = () => {
    if (sort_field === 'units' || sort_field === 'users' || sort_field === 'research_areas') {
      return {
        _count: sort
      }
    }
    return sort
  }

  const sortFieldGenerator = () => {
    if (sort_field === 'users') {
      return 'bridge_profiles'
    }
    if (sort_field === 'fullname') {
      return 'first_name'
    }
    if (sort_field === 'duration') {
      return 'duration_start'
    }
    return sort_field
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
      [sortFieldGenerator() as string]: sortGenerator()
    } : undefined
  }

  prisma.project.findMany({
    orderBy: {
      bridge_profiles: {
        
      }
    }
  })

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