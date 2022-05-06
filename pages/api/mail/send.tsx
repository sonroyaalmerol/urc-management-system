import { sendMail as send } from '../../../lib/server/mail'
import { getSession } from 'next-auth/react'

import type { NextApiRequest, NextApiResponse } from 'next'

const sendMail = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })

  if (req.method === 'POST' && session) {
    const { subject, to, content }: { subject: string, to: string | string[], content: string } = JSON.parse(req.body)
    try {
      const response = await send(subject, to, content)
      return res.status(200).json(response)
    } catch(err) {
      console.error(err.message)
      return res.status(500).json({ error: err })
    }

  } else {
    // Handle any other HTTP method
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}

export default sendMail