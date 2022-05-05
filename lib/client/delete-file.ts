const deleteFile = async (id: string) => {
  const res = await fetch("/api/files/delete", {
      method: "POST",
      body: JSON.stringify({ id: id }),
  }).then((res) => res.json());

  return res
}

export default deleteFile