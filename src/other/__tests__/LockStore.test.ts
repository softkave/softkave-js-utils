import {describe, expect, test, vi} from 'vitest';
import {getNewId} from '../../id/index.js';
import {getDeferredPromise} from '../../promise/getDeferredPromise.js';
import {LockStore, LockableResource} from '../LockStore.js';
import {waitTimeout} from '../waitTimeout.js';

describe('LockStore', () => {
  test('run', async () => {
    const store = new TestLockStore();
    const lockName = 'lock';

    let fn01Done = false;
    let fn02Done = false;
    let fn03Done = false;

    const fn01 = vi.fn().mockImplementation(async () => {
      await waitTimeout(0);
      fn01Done = true;
    });
    const fn02 = vi.fn().mockImplementation(async () => {
      expect(fn01Done).toBeTruthy();
      await waitTimeout(0);
      fn02Done = true;
    });
    const fn03 = vi.fn().mockImplementation(async () => {
      expect(fn02Done).toBeTruthy();
      await waitTimeout(0);
      fn03Done = true;
    });

    const pLock01 = store.run(lockName, fn01);
    const pLock02 = store.run(lockName, fn02);
    const pLock03 = store.run(lockName, fn03);

    await Promise.all([pLock01, pLock02, pLock03]);
    expect(fn01Done).toBeTruthy();
    expect(fn02Done).toBeTruthy();
    expect(fn03Done).toBeTruthy();
    store.expectIsEmpty(lockName);
  });
});

describe('LockableResource', () => {
  test('run', async () => {
    const r00 = 'zero';
    const r01 = 'one';
    const r02 = 'two';
    const r03 = 'three';
    const lockName = getNewId();
    const store = new LockStore();
    const rLock = new LockableResource<string>(store, r00, lockName);

    const fn01 = vi.fn().mockImplementation(async (data: string) => {
      expect(data).toBe(r00);
      await waitTimeout(0);
      return r01;
    });
    const fn02 = vi.fn().mockImplementation(async (data: string) => {
      expect(data).toBe(r01);
      await waitTimeout(0);
      return r02;
    });
    const fn03 = vi.fn().mockImplementation(async (data: string) => {
      expect(data).toBe(r02);
      await waitTimeout(0);
      return r03;
    });

    const pLock01 = rLock.run(fn01);
    const pLock02 = rLock.run(fn02);
    const pLock03 = rLock.run(fn03);

    await Promise.all([pLock01, pLock02, pLock03]);
  });

  test('wait, remaining=0', async () => {
    const store = new LockStore();
    const lockName = 'lock' + getNewId();
    await store.wait(lockName, 0);
    // calling wait() with remaining=0 should return immediately, so test will
    // timeout if that condition is not met
  });

  test('wait, remaining=1, locks=0', async () => {
    const store = new LockStore();
    const lockName = 'lock' + getNewId();
    await store.wait(lockName, 1);
    // calling wait() on a lock with 0 locks should return immediately, so test
    // will timeout if that condition is not met
  });

  test.each([
    {locks: 1, remaining: 1, expectedCallOrder: ['run0', 'wait']},
    {
      locks: 2,
      remaining: 1,
      expectedCallOrder: ['run0', 'wait', 'run1'],
    },
    {
      locks: 3,
      remaining: undefined,
      expectedCallOrder: ['run0', 'run1', 'run2', 'wait'],
    },
  ])(
    'wait, remaining=$remaining, locks=$locks',
    async ({locks, remaining, expectedCallOrder}) => {
      const store = new LockStore();
      const lockName = 'lock' + getNewId();
      const pRuns: Array<Promise<void>> = [];
      const pHasCalledWait = getDeferredPromise();
      const callOrder: Array<string> = [];
      const waitCallId = 'wait';

      for (let i = 0; i < locks; i++) {
        pRuns.push(
          store.run(lockName, async () => {
            callOrder.push(`run${i}`);
            await pHasCalledWait.promise;
          })
        );
      }

      const pWait = store.wait(lockName, remaining);
      pHasCalledWait.resolve();
      pWait.then(() => {
        callOrder.push(waitCallId);
      });

      await Promise.all([...pRuns, pWait]);
      expect(callOrder).toEqual(expectedCallOrder);
    }
  );
});

class TestLockStore extends LockStore {
  expectIsEmpty(name: string) {
    const queue = this.getLockQueue(name, /** init */ true);
    expect(queue.length).toBe(0);
  }
}
