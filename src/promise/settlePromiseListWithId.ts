import {Dictionary, isArray} from 'lodash';
import {settlePromiseWithId} from './settlePromiseWithId';
import {GetSettledPromise, PromiseWithId} from './types';

export const settlePromiseListWithId = async <T extends PromiseWithId>(
  promises: T[] | Dictionary<T>
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
