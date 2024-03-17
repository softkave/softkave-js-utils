import assert from 'assert';
import {AnyFn} from '../types';

export function loop<
  TOtherParams extends unknown[],
  TFn extends AnyFn<[number, ...TOtherParams]>,
>(
  fn: TFn,
  /** counting is `0`-index based, so last iteration would be `6` if count is
   * `7`, while first iteration will be `0`. */
  max: number,
  ...otherParams: TOtherParams
) {
  assert(max >= 0);

  for (let i = 0; i < max; i++) {
    fn(i, ...otherParams);
  }
}
