import {describe, expect, test} from 'vitest';
import {
  getConjoinedPromise,
  kConjoinedPromiseSettlementType,
} from '../getConjoinedPromise.js';

describe('getConjoinedPromise', () => {
  test.each([
    [kConjoinedPromiseSettlementType.all],
    [kConjoinedPromiseSettlementType.allSettled],
  ])(
    'should resolve when all the promises added to it are resolved %s',
    async settlementType => {
      const conjoinedPromise = getConjoinedPromise({settlementType});
      const p1 = new Promise(resolve => setTimeout(() => resolve('p1'), 100));
      const p2 = new Promise(resolve => setTimeout(() => resolve('p2'), 200));
      conjoinedPromise.add(p1);
      conjoinedPromise.add(p2);
      const p3 = conjoinedPromise.newDeferred();
      conjoinedPromise.start();
      p3.resolve();
      await conjoinedPromise.deferredPromise.promise;
      expect(conjoinedPromise.deferredPromise.isPromiseResolved()).toBe(true);
    }
  );

  test('should reject when one of the promises added to it is rejected', async () => {
    const conjoinedPromise = getConjoinedPromise({
      settlementType: kConjoinedPromiseSettlementType.all,
    });
    await expect(async () => {
      const p1 = new Promise(resolve => setTimeout(() => resolve('p1'), 100));
      const p2 = conjoinedPromise.newDeferred();
      conjoinedPromise.add(p1);
      conjoinedPromise.start();
      p2.reject('p2');
      await conjoinedPromise.deferredPromise.promise;
    }).rejects.toThrow();
  });

  test('should resolve when one of the promises added to it is rejected and settlementType is allSettled', async () => {
    const conjoinedPromise = getConjoinedPromise({
      settlementType: kConjoinedPromiseSettlementType.allSettled,
    });
    const p1 = new Promise(resolve => setTimeout(() => resolve('p1'), 100));
    const p2 = new Promise((_, reject) =>
      setTimeout(() => reject('p2'), 200)
    ).catch(() => {});
    conjoinedPromise.add(p1);
    conjoinedPromise.add(p2);
    conjoinedPromise.start();
    await conjoinedPromise.deferredPromise.promise;
    expect(conjoinedPromise.deferredPromise.isPromiseResolved()).toBe(true);
  });
});
