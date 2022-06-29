import { FileUpload } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { Session } from "next-auth"
import { getSession } from "next-auth/react"
import cleanString from "../../../../utils/cleanString"
import { CHANGE_PROJECT_STATUS } from "../../../../utils/permissions"
import { roleChecker } from "../../../../utils/roleChecker"
import { deleteFile } from "../../../../utils/server/file"
import handleError from "../../../../utils/server/handleError"


const deleteHandler = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { id } = req.query

  const fileUpload = await prisma.fileUpload.findUnique({ 
    where: {
      id: id as string
    },
    include: {
      profile: true
    }
  })

  if (!roleChecker(session.profile, CHANGE_PROJECT_STATUS) && session.profile.id !== fileUpload.profile.id) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  const file = await deleteFile(id as string)

  return res.status(200).json({ success: true, data: file })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized access.' })
  }

  return await handleError(async () => {
    if (req.method === 'DELETE') {
      return await deleteHandler(req, res, session)
    }
    
    return res.status(405).json({ error: `Method '${req.method}' Not Allowed` });  
  }, res)
}