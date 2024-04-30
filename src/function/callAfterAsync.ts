import {AnyFn} from '../types.js';

/** Returns a function that calls `afterFn` with the result of, and arguments of
 * `fn`. */
export function callAfterAsync<
  TFn extends AnyFn,
  TAfterFn extends AnyFn<[Awaited<ReturnType<TFn>>, ...Parameters<TFn>]>,
>(fn: TFn, afterFn: TAfterFn) {
  return async (...args: Parameters<TFn>) => {
    const result = await fn(...args);
    return await afterFn(result, ...args);
  };
}
