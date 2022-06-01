const cleanString = (string: string) => {
  if (string === 'undefined' || string === 'null') {
    return null
  }
  return string?.trim().replace(/(<([^>]+)>)/gi, "") ?? null
}

export default cleanString