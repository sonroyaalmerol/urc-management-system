import { NextApiResponse } from "next"

const handleError = async (fn: () => any, res: NextApiResponse) => {
  try {
    await fn()
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export default handleError