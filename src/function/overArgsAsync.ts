import {AnyFn} from '../types.js';

/** Returns a function that calls input functions in parallel with any arguments
 * passed to it. */
export function overArgsAsync<
  TFn extends AnyFn,
  TUsePromiseSettled extends boolean,
  TTransformFn extends AnyFn<
    [
      TUsePromiseSettled extends true
        ? Array<PromiseSettledResult<Awaited<ReturnType<TFn>>>>
        : Array<Awaited<ReturnType<TFn>>>,
    ]
  >,
>(
  fns: TFn[],
  /** Whether to use `Promise.allSettled()` or `Promise.all()` */
  usePromiseSettled: TUsePromiseSettled,
  transformFn: TTransformFn
) {
  return async (
    ...args: Parameters<TFn>
  ): Promise<Awaited<ReturnType<TTransformFn>>> => {
    const promises = fns.map(fn => fn(...args));
    const result = await (usePromiseSettled
      ? Promise.allSettled(promises)
      : Promise.all(promises));
    return transformFn(result);
  };
}
