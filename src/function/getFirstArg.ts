// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFirstArg<T extends any[]>(...args: T): T[0] {
  return args[0];
}
