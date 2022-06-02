const fetchWithFile = async (url, data, method?) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] instanceof FileList) {
      Array.from(data[key]).forEach((file) => {
        formData.append(key, file as File)
      })
    } else {
      formData.append(key, data[key])
    }
  })
  const response = await fetch(url, {
    method: method ?? 'POST',
    body: formData
  }).then((i) => i.json())

  return response
}

export default fetchWithFile