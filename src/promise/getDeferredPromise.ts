import assert from 'assert';
import {isBoolean} from 'lodash-es';
import {AnyFn} from '../types.js';

export interface DeferredPromise<T = void> {
  promise: Promise<T>;
  isDone: () => boolean;
  isPromiseResolved: () => boolean;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
}

export function getDeferredPromise<T = void>(): DeferredPromise<T> {
  let pResolveFn: AnyFn<[T | PromiseLike<T>]> | undefined;
  let pRejectFn: AnyFn | undefined;
  let isResolved: boolean | undefined;

  const promise = new Promise<T>((resolve, reject) => {
    pResolveFn = resolve;
    pRejectFn = reject;
  });

  const resolveFn = (value: T) => {
    if (isBoolean(isResolved)) {
      return;
    }

    isResolved = true;
    assert(pResolveFn);
    pResolveFn(value);
  };

  const rejectFn = (error?: unknown) => {
    if (isBoolean(isResolved)) {
      return;
    }

    isResolved = false;
    assert(pRejectFn);
    pRejectFn(error);
  };

  const isDone = () => isBoolean(isResolved);
  const isPromiseResolved = () => isResolved ?? false;

  return {
    promise,
    isDone,
    isPromiseResolved,
    resolve: resolveFn,
    reject: rejectFn,
  };
}
