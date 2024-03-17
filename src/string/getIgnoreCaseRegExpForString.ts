export function getIgnoreCaseRegExpForString(str: string) {
  return new RegExp(`^${str}$`, 'i');
}
