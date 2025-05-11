export function isObjectEmpty(
  data: Record<string | number, unknown> | unknown[]
) {
  for (const key in data) {
    return false;
  }

  return true;
}
