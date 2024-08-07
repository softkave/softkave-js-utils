import assert from 'assert';
import {AnyFn} from '../types.js';
import {LoopAsyncSettlementType, kLoopAsyncSettlementType} from './types.js';

/** See {@link loop} */
export async function loopAsync<
  TOtherParams extends unknown[],
  TFn extends AnyFn<[number, ...TOtherParams]>,
>(
  fn: TFn,
  max: number,
  settlement: LoopAsyncSettlementType,
  ...otherParams: TOtherParams
) {
  assert(max >= 0);

  if (settlement === kLoopAsyncSettlementType.oneByOne) {
    for (let i = 0; i < max; i++) {
      await fn(i, ...otherParams);
    }
  } else {
    const promises: Array<Promise<unknown>> = Array(max);

    for (let i = 0; i < max; i++) {
      promises.push(fn(i, ...otherParams));
    }

    if (settlement === kLoopAsyncSettlementType.all) {
      await Promise.all(promises);
    } else if (settlement === kLoopAsyncSettlementType.allSettled) {
      await Promise.allSettled(promises);
    } else {
      throw new Error(`Unknown promise settlement type ${settlement}`);
    }
  }
}
