import assert from 'assert';
import {describe, expect, test, vi} from 'vitest';
import {NoopLogger} from '../../logger/index.js';
import {PromiseStore, getDeferredPromise} from '../../promise/index.js';
import {expectErrorThrownAsync} from '../../testing/expectErrorThrown.js';
import {waitTimeout} from '../waitTimeout.js';

describe('PromiseStore', () => {
  test('forget', async () => {
    try {
      const store = new TestPromiseStore();
      const dPromise01 = getDeferredPromise();

      store.forget(dPromise01.promise);
      dPromise01.reject(new Error('Reject error!'));

      await store.flush();
    } catch (error) {
      assert.fail('Error not caught');
    }
  });

  test('flush', async () => {
    const store = new TestPromiseStore();
    const dPromise01 = getDeferredPromise();
    const dPromise02 = getDeferredPromise();
    const dPromise03 = getDeferredPromise();
    const thenFn = vi.fn();
    dPromise01.promise.then(thenFn);
    dPromise02.promise.then(thenFn);
    dPromise03.promise.then(thenFn);

    store.forget(dPromise01.promise);
    store.forget(dPromise02.promise);
    store.forget(dPromise03.promise);
    const pFlush = store.flush();
    dPromise01.resolve();
    dPromise02.resolve();
    dPromise03.resolve();
    await pFlush;

    expect(thenFn).toHaveBeenCalledTimes(3);
    await waitTimeout(0);
    store.expectIsEmpty();
  });

  test('close', async () => {
    const store = new TestPromiseStore();

    store.close();

    await expectErrorThrownAsync(() => store.forget(Promise.resolve()));
  });
});

class TestPromiseStore extends PromiseStore {
  constructor() {
    super(new NoopLogger());
  }

  expectIsEmpty() {
    expect(Object.values(this.promiseRecord).length).toBe(0);
  }
}
