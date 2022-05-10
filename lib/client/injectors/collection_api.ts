import type { NextApiRequest, NextApiResponse } from 'next';
import type { Function } from '../../../types/api';

const injector = async (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  let { page: raw_page, per_page: raw_per_page, search, fields } = req.query
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

  const ORarray = [];

  if (search) {
    (fields as string).split(',').forEach((i) => {
      if(i !== 'units') {
        ORarray.push({
          [i]: {
            mode: 'insensitive',
            contains: search
          }
        })
      } else {
        ORarray.push({
          bridge_units: {
            some: {
              unit: {
                name: {
                  mode: 'insensitive',
                  contains: search
                },
              }
            }
          }
        })
        ORarray.push({
          bridge_units: {
            some: {
              unit: {
                id: {
                  mode: 'insensitive',
                  contains: search
                },
              }
            }
          }
        })
        ORarray.push({
          bridge_units: {
            some: {
              unit: {
                parent_unit: {
                  name: {
                    mode: 'insensitive',
                    contains: search
                  }
                },
              }
            }
          }
        })
        ORarray.push({
          bridge_units: {
            some: {
              unit: {
                parent_unit: {
                  id: {
                    mode: 'insensitive',
                    contains: search
                  }
                },
              }
            }
          }
        })
      }
    })
  }

  const args = {
    skip: (per_page ?? 10) * (page ? (page - 1) : 0),
    take: (per_page ?? 10),
    where: search ? {
      OR: ORarray
    } : undefined
  }

  try {
    [count, rawData] = await fn(args);

    data = rawData.map((entry) => {
      let processedEntry = { ...entry }
      Object.keys(processedEntry).forEach((key) => {
        if (key === 'bridge_users') {
          processedEntry.users = processedEntry[key].map((user) => {
            let processedUser = { ...user }
            delete processedUser.user

            let userObject = user.user
            delete userObject.id
            delete userObject.created_at
            delete userObject.updated_at

            return { ...processedUser, ...userObject }
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