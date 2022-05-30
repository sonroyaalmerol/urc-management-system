const cleanString = (string: string) => {
  return string?.trim().replace(/(<([^>]+)>)/gi, "") ?? null
}

export default cleanString