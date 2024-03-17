export function isLowercaseEqual(
  str00: string | undefined,
  str01: string | undefined,
  useLowercase = true
) {
  if (useLowercase) {
    return str00?.toLowerCase() === str01?.toLowerCase();
  } else {
    return str00 === str01;
  }
}
