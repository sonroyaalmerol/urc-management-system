import type { NextApiRequest, NextApiResponse } from 'next';

const injector = async (req: NextApiRequest, res: NextApiResponse, fn: (any) => Promise<any>) => {
  const { id } = req.query

  const returnError = (code: number, message: string) => {
    return res.status(code).json({
      error: message
    })
  }

  const args = {
    where: {
      OR: [
        {
          id: id
        },
        {
          slug: id
        }
      ]
    }
  }

  let rawData: any = {};
  let data: any = {}

  try {
    rawData = await fn(args)

    data = { ...rawData }

    Object.keys(data).forEach((key) => {
      if (key === 'bridge_users') {
        data.users = data[key].map((user) => {
          let processedUser = { ...user }
          delete processedUser.user

          let userObject = user.user
          delete userObject.id
          delete userObject.created_at
          delete userObject.updated_at

          return { ...processedUser, ...userObject }
        })

        delete data[key]
      }
    })
  } catch (err) {
    return returnError(500, err.message);
  }

  return res.status(200).json({
    data
  })
}

export default injector