import assert from 'assert';
import {AnyFn} from '../types.js';

export function getDeferredPromise<T = void>() {
  let internalResolvePromise: AnyFn<[T | PromiseLike<T>]> | undefined;
  let internalRejectPromise: AnyFn | undefined;

  const promise = new Promise<T>((resolve, reject) => {
    internalResolvePromise = resolve;
    internalRejectPromise = reject;
  });

  const resolveFn = (value: T) => {
    assert(internalResolvePromise);
    internalResolvePromise(value);
  };

  const rejectFn = (error?: unknown) => {
    assert(internalRejectPromise);
    internalRejectPromise(error);
  };

  return {promise, resolve: resolveFn, reject: rejectFn};
}
