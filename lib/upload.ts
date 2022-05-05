const upload = async (file) => {
  const formData = new FormData()
  formData.append("file", file)

  const res: any = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
  }).then((res) => res.json())

  return res?.data
}

export default upload