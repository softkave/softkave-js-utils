import {SettledPromise} from './types';

export function settlePromise<T = unknown>(p: Promise<T>) {
  return new Promise<SettledPromise<T>>(resolve => {
    p.then(result => resolve({resolved: true, value: result})).catch(error =>
      resolve({resolved: false, reason: error})
    );
  });
}
