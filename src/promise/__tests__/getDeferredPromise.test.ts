import {getDeferredPromise} from '../getDeferredPromise';

describe('promiseFns', () => {
  test('getDeferredPromise, resolve', () => {
    const dPromise = getDeferredPromise<number>();
    const afterMakeMs = Date.now();
    const expectedMs = Date.now();
    dPromise.promise.then((ms): void => {
      expect(expectedMs).toBe(ms);
      expect(ms).toBeGreaterThanOrEqual(afterMakeMs);
    });
    dPromise.resolve(expectedMs);
  });

  test('getDeferredPromise, reject', () => {
    const dPromise = getDeferredPromise();
    const afterMakeMs = Date.now();
    const expectedError = new Error();
    dPromise.promise.catch((error: Error): void => {
      expect(expectedError).toBe(error);
      expect(Date.now()).toBeGreaterThanOrEqual(afterMakeMs);
    });
    dPromise.reject(expectedError);
  });

  test('getDeferredPromise, finally', () => {
    const dPromise = getDeferredPromise();
    const afterMakeMs = Date.now();
    dPromise.promise.finally((): void => {
      expect(Date.now()).toBeGreaterThanOrEqual(afterMakeMs);
    });
    dPromise.resolve();
  });
});
