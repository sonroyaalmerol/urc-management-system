
const injector = async (req, res, fn) => {
  let { page, per_page, search, fields } = req.query
  page = page ? parseInt(page) : 1
  per_page = per_page ? parseInt(per_page) : 10

  const returnError = (code, message) => {
    res.status(code).json({
      error: message,
      page,
      per_page,
      total_pages: 0
    })
  }

  if (per_page < 1) {
    returnError(400, 'Invalid per_page value.');
    return;
  }

  if (search && !fields) {
    returnError(400, '"fields" selection required when searching.');
    return;
  }

  let count = 0;
  let data = [];

  const args = {
    skip: (per_page ?? 10) * (page ? (page - 1) : 0),
    take: (per_page ?? 10),
    where: search ? {
      OR: fields.split(',').map((i) => ({
        [i]: {
          mode: 'insensitive',
          contains: search
        }
      }))
    } : undefined
  }

  try {
    [count, data] = await fn(args);
  } catch (err) {
    returnError(500, err.message);
    return;
  }

  const total_pages = Math.ceil(count / per_page)
  if (total_pages > 0 && (page > total_pages || page < 1)) {
    returnError(400, 'Invalid page value.');
    return;
  }

  res.status(200).json({
    data,
    page,
    per_page,
    total_pages
  })
}
export default injector