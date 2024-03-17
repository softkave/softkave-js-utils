export function calculateMaxPages(count: number, pageSize: number) {
  return Math.ceil(count / pageSize);
}
