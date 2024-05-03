import {isArray} from 'lodash-es';
import {settlePromiseWithId} from './settlePromiseWithId.js';
import {GetSettledPromise, PromiseWithId} from './types.js';

export const settlePromiseListWithId = async <T extends PromiseWithId>(
  promises: T[] | Record<string, T>
) => {
  const mappedPromises: Array<Promise<GetSettledPromise<T>>> = [];
  const entries = isArray(promises)
    ? promises.entries()
    : Object.entries(promises);

  for (const [, promise] of entries) {
    mappedPromises.push(settlePromiseWithId(promise));
  }

  return await Promise.all(mappedPromises);
};
