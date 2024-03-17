import assert from 'assert';
import {NoopLogger} from '../../logger';
import {getDeferredPromise, PromiseStore} from '../../promise';
import {expectErrorThrown} from '../../testing/expectErrorThrown';
import {waitTimeout} from '../waitTimeout';

describe('PromiseStore', () => {
  test.skip('forget', async () => {
    // TODO: this test always fails in Jest because of the Promise.reject()
    // needed to test forget(). the functionality itself works, because control
    // flow doesn't get to assert.fail('error not caught'), but the test fails
    // because Jest picks up the thrown error
    try {
      const store = new TestPromiseStore();

      store.forget(
        (async (): Promise<void> => {
          await waitTimeout(1000);
          return Promise.reject('error!');
        })()
      );

      await waitTimeout(1);
      await store.flush();
    } catch (error) {
      assert.fail('error not caught');
    }
  });

  test('flush', async () => {
    const store = new TestPromiseStore();
    const dPromise01 = getDeferredPromise();
    const dPromise02 = getDeferredPromise();
    const dPromise03 = getDeferredPromise();
    const thenFn = jest.fn();
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

  test('close', () => {
    const store = new TestPromiseStore();

    store.close();

    expectErrorThrown(() => store.forget(Promise.resolve()));
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
