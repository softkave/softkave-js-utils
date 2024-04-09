export function sortStringListLexicographically(stringList: string[]) {
  return stringList.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}
