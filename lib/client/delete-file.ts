import { FileUpload } from "@prisma/client";

const deleteFile = async (id: string) => {
  const response  = await fetch("/api/files/delete", {
      method: "POST",
      body: JSON.stringify({ id: id }),
  });

  const json = await response.json()
  
  if (response.ok) {
    return json as FileUpload
  }

  throw new Error(json.error)
}

export default deleteFile