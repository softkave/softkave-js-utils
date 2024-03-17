import assert from 'assert';
import {AnyFn} from '../types';
import {LoopAsyncSettlementType} from './types';

/**
 * See {@link loopAndCollate}
 * Returns a list containing results of `fn` invocations
 */
export async function loopAndCollateAsync<
  TOtherParams extends unknown[],
  TFn extends AnyFn<[number, ...TOtherParams]>,
  TSettlementType extends LoopAsyncSettlementType,
  TResult = TSettlementType extends 'allSettled'
    ? PromiseSettledResult<Awaited<ReturnType<TFn>>>[]
    : Awaited<ReturnType<TFn>>[],
>(
  fn: TFn,
  max: number,
  settlement: TSettlementType,
  ...otherParams: TOtherParams
): Promise<TResult> {
  assert(max >= 0);

  if (settlement === 'oneByOne') {
    const result: unknown[] = Array(max);

    for (let i = 0; i < max; i++) {
      result[i] = await fn(i, ...otherParams);
    }

    return result as TResult;
  } else {
    const promises: unknown[] = Array(max);

    for (let i = 0; i < max; i++) {
      promises[i] = fn(i, ...otherParams);
    }

    if (settlement === 'all') {
      return (await Promise.all(promises)) as TResult;
    } else if (settlement === 'allSettled') {
      return (await Promise.allSettled(promises)) as TResult;
    }
  }

  throw new Error(`Unknown promise settlement type ${settlement}`);
}
