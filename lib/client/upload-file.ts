import { FileUpload } from "@prisma/client"

const upload = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
  })

  const json = await response.json()
  
  if (response.ok) {
    return json as FileUpload
  }

  throw new Error(json.error)
}

export default upload