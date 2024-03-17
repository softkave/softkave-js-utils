export function waitTimeout(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms));
}

export function makeWaitTimeoutFn(timeoutMs: number) {
  return () => waitTimeout(timeoutMs);
}
