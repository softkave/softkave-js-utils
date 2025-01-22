import {describe, expect, test, vi} from 'vitest';
import {NoopLogger} from '../../logger/index.js';
import {waitTimeout} from '../../other/waitTimeout.js';
import {expectErrorThrownAsync} from '../../testing/expectErrorThrown.js';
import {PromiseStore, getDeferredPromise} from '../index.js';

describe('PromiseStore', () => {
  test('flush', async () => {
    const store = new TestPromiseStore();
    const dPromise01 = getDeferredPromise();
    const dPromise02 = getDeferredPromise();
    const dPromise03 = getDeferredPromise();
    const thenFn = vi.fn();
    dPromise01.promise.then(thenFn);
    dPromise02.promise.then(thenFn);
    dPromise03.promise.then(thenFn);

    store.callAndForget(() => dPromise01.promise);
    store.callAndForget(() => dPromise02.promise);
    store.callAndForget(() => dPromise03.promise);
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

    await expectErrorThrownAsync(() =>
      store.callAndForget(() => Promise.resolve())
    );
  });

  test('callAndForget', async () => {
    const store = new TestPromiseStore();
    const fn = vi.fn();
    store.callAndForget(() => fn());
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('callAndForget, sync error caught', async () => {
    const store = new TestPromiseStore();
    const fn = vi.fn(() => {
      throw new Error('Error!');
    });
    store.callAndForget(fn);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('callAndForget, async error caught', async () => {
    const store = new TestPromiseStore();
    const fn = vi.fn(async () => {
      await waitTimeout(20);
      throw new Error('Error!');
    });
    store.callAndForget(fn);
    expect(fn).toHaveBeenCalledTimes(1);
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
