import prisma from "../../../../lib/prisma-client"

export default async function handler(req, res) {
  let { page, per_page, search, fields } = req.query
  page = page ? parseInt(page) : 1
  per_page = per_page ? parseInt(per_page) : 10

  if (per_page < 1) {
    res.status(400).json({
      error: 'Invalid per_page value.',
      page,
      per_page,
      total_pages: -1
    })
    return;
  }

  let count = 0;
  let researchers = [];

  if (search && !fields) {
    res.status(400).json({
      error: '"fields" selection required when searching.',
      page,
      per_page,
      total_pages: 0
    })
    return;
  }

  try {
    [count, researchers] = await prisma.$transaction([
      prisma.user.count({
        where: {
          bridge_roles: {
            some: {
              user_role: {
                id: 'researcher'
              }
            }
          }
        }
      }),
      prisma.user.findMany({
        skip: (per_page ?? 10) * (page ? (page - 1) : 0),
        take: (per_page ?? 10),
        where: {
          bridge_roles: {
            some: {
              user_role: {
                id: 'researcher'
              }
            }
          },
          where: search ? {
            OR: fields.split(',').map((i) => ({
              [i]: {
                mode: 'insensitive',
                contains: search
              }
            }))
          } : undefined
        }
      })
    ])
  } catch (err) {
    res.status(500).json({
      error: err.message,
      page,
      per_page,
      total_pages: 0
    })
    return;
  }

  const total_pages = Math.ceil(count / per_page)
  if (total_pages > 0 && (page > total_pages || page < 1)) {
    res.status(400).json({
      error: 'Invalid page value.',
      page,
      per_page,
      total_pages
    })
    return;
  }

  res.status(200).json({
    data: researchers,
    page,
    per_page,
    total_pages
  })
}