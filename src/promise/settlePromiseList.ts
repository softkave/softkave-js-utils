import {settlePromise} from './settlePromise';
import {SettledPromise} from './types';

export const settlePromiseList = <TPromise extends Promise<unknown>[]>(
  promises: TPromise
): Promise<
  SettledPromise<
    Parameters<NonNullable<Parameters<TPromise[number]['then']>[0]>>[0],
    Parameters<NonNullable<Parameters<TPromise[number]['catch']>[0]>>[0]
  >[]
> => {
  const mappedPromises = promises.map(settlePromise);
  return Promise.all(mappedPromises);
};
