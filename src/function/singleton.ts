import {isUndefined, noop} from 'lodash';
import {cast} from '../other';

export type SingletonFnInitFn<Data> = () => Data;
export type SingletonFnDisposeFn<Data> = (data: Data) => void | Promise<void>;

export interface SingletonFn<Data> {
  invalidate: () => Promise<void>;
  release: () => Promise<void>;
  (): Data;
}

export function singletonFn<Data>(
  initFn: SingletonFnInitFn<Data>,
  disposeFn: SingletonFnDisposeFn<Data> = noop
): SingletonFn<Data> {
  let data: Data | undefined = undefined;
  let refs = 0;
  const mainFn = () => {
    refs++;

    if (isUndefined(data)) {
      data = initFn();
    }

    return data;
  };

  const invalidateFn = async () => {
    if (!isUndefined(data)) {
      await disposeFn(data);
    }

    data = undefined;
  };

  const releaseFn = async () => {
    refs--;

    if (refs === 0 && !isUndefined(data)) {
      await disposeFn(data);
      data = undefined;
    }
  };

  cast<SingletonFn<Data>>(mainFn).invalidate = invalidateFn;
  cast<SingletonFn<Data>>(mainFn).release = releaseFn;
  return cast<SingletonFn<Data>>(mainFn);
}
