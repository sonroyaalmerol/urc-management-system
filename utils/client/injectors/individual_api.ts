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
      if (key === 'bridge_profiles') {
        data.users = data[key].map((profileBridge) => {
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