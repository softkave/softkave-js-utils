export function calculatePageSize(
  count: number,
  pageSize: number,
  /** zero-index based page */ page: number
) {
  count = Math.max(count, 0);
  pageSize = Math.max(pageSize, 0);
  page = Math.max(page, 0);

  if (count === 0 ?? pageSize === 0) {
    return 0;
  }

  const maxFullPages = Math.floor(count / pageSize);
  const pageCount =
    page < maxFullPages ? pageSize : count - maxFullPages * pageSize;
  return pageCount;
}
