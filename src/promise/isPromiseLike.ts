export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value;
}

export function isPromise(value: unknown): value is Promise<unknown> {
  return isPromiseLike(value) && typeof value.then === 'function';
}
