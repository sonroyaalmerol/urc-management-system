import type { NextApiRequest, NextApiResponse } from 'next';
import { Function } from '../../types/collection_api';

const injector = async (req: NextApiRequest, res: NextApiResponse, fn: Function) => {
  let { page: raw_page, per_page: raw_per_page, search, fields } = req.query
  const page: number = raw_page ? parseInt(raw_page as string) : 1
  const per_page: number = raw_per_page ? parseInt(raw_per_page as string) : 10

  const returnError = (code: number, message: string) => {
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

  let count: number = 0;
  let data: any = [];

  const args = {
    skip: (per_page ?? 10) * (page ? (page - 1) : 0),
    take: (per_page ?? 10),
    where: search ? {
      OR: (fields as string).split(',').map((i) => ({
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