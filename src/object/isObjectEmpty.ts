export function isObjectEmpty(data: Record<string | number, unknown>) {
  return Object.keys(data).length === 0;
}
