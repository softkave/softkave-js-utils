import assert from 'assert';
import {AnyFn} from '../types.js';

/**
 * See {@link loop}
 * Returns a list containing results of `fn` invocations
 */
export function loopAndCollate<
  TOtherParams extends unknown[],
  TFn extends AnyFn<[number, ...TOtherParams]>,
>(fn: TFn, max: number, ...otherParams: TOtherParams): Array<ReturnType<TFn>> {
  assert(max >= 0);
  const result: Array<ReturnType<TFn>> = Array(max);

  for (let i = 0; i < max; i++) {
    result[i] = fn(i, ...otherParams);
  }

  return result;
}
