import { parse, parseISO } from "date-fns"

const isValidDate = (d) => {
  return d instanceof Date && !isNaN(d as any);
}

const handleDate = (date: string | Date) => {
  let res
  if (typeof date === 'string') {
    res = parse(date, "yyyy-MM-dd'T'HH:mm", new Date())
    if (isValidDate(res)) {
      return res
    }

    res = parse(date, "yyyy-MM-dd", new Date())
    if (isValidDate(res)) {
      return res
    }

    res = parseISO(date)
    if (isValidDate(res)) {
      return res
    }

    return null
  }
  return date
}

export default handleDate