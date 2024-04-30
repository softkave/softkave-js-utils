import {
  GetSettledPromise,
  InferPromiseWithIdData,
  PromiseWithId,
} from './types.js';

export function settlePromiseWithId<T extends PromiseWithId>(p: T) {
  return new Promise<GetSettledPromise<T>>(resolve => {
    p.promise
      .then(result =>
        resolve({
          ...p,
          resolved: true,
          value: result as InferPromiseWithIdData<T>,
        })
      )
      .catch(error => resolve({...p, resolved: false, reason: error}));
  });
}
