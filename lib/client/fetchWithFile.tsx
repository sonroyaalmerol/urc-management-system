const fetchWithFile = async (url, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] instanceof FileList) {
      formData.append(key, data[key][0])
    } else {
      formData.append(key, data[key])
    }
  })
  const response = await fetch(url, {
    method: 'POST',
    body: formData
  }).then((i) => i.json())

  return response
}

export default fetchWithFile