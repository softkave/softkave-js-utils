import {describe, expect, test, vi} from 'vitest';
import {waitTimeout} from '../../other/index.js';
import {expectErrorThrownAsync} from '../../testing/expectErrorThrown.js';
import {loopAsync} from '../loopAsync.js';
import {kLoopAsyncSettlementType} from '../types.js';

describe('fns', () => {
  test('loopAsync, oneByOne', async () => {
    const max = 10;
    const fn = vi.fn();
    const extraArgs = [0, 1, 2];

    await loopAsync(fn, max, kLoopAsyncSettlementType.oneByOne, ...extraArgs);

    expect(fn).toHaveBeenCalledTimes(max);
    Array(max)
      .fill(0)
      .forEach((unused, index) => {
        const fnArgs = [index, ...extraArgs];
        const nthCallArgs = fn.mock.calls[index];
        expect(fnArgs).toEqual(nthCallArgs);
      });

    // There should be only 1 invocation if error is thrown
    const fnThrows = vi.fn().mockImplementation(() => {
      throw new Error();
    });

    await expectErrorThrownAsync(async () => {
      await loopAsync(
        fnThrows,
        max,
        kLoopAsyncSettlementType.oneByOne,
        ...extraArgs
      );
    });

    expect(fnThrows).toHaveBeenCalledTimes(1);
  });

  test('loopAsync, all', async () => {
    const max = 10;
    const fn = vi.fn();
    const extraArgs = [0, 1, 2];

    await loopAsync(fn, max, kLoopAsyncSettlementType.all, ...extraArgs);

    expect(fn).toHaveBeenCalledTimes(max);
    Array(max)
      .fill(0)
      .forEach((unused, index) => {
        const fnArgs = [index, ...extraArgs];
        const nthCallArgs = fn.mock.calls[index];
        expect(fnArgs).toEqual(nthCallArgs);
      });

    // There should be only `max` invocations even if error is thrown
    const fnThrows = vi.fn().mockImplementation(async () => {
      await waitTimeout(0);
      throw new Error();
    });

    await expectErrorThrownAsync(async () => {
      await loopAsync(
        fnThrows,
        max,
        kLoopAsyncSettlementType.all,
        ...extraArgs
      );
    });

    expect(fnThrows).toHaveBeenCalledTimes(max);
  });

  test('loopAsync, allSettled', async () => {
    const max = 10;
    const fn = vi.fn();
    const extraArgs = [0, 1, 2];

    await loopAsync(fn, max, kLoopAsyncSettlementType.allSettled, ...extraArgs);

    expect(fn).toHaveBeenCalledTimes(max);
    Array(max)
      .fill(0)
      .forEach((unused, index) => {
        const fnArgs = [index, ...extraArgs];
        const nthCallArgs = fn.mock.calls[index];
        expect(fnArgs).toEqual(nthCallArgs);
      });

    // There should be only `max` invocations even if error is thrown
    const fnThrows = vi.fn().mockImplementation(async () => {
      await waitTimeout(0);
      throw new Error();
    });

    // Should not throw outside of function even if `fn` throws error
    await loopAsync(
      fnThrows,
      max,
      kLoopAsyncSettlementType.allSettled,
      ...extraArgs
    );

    expect(fnThrows).toHaveBeenCalledTimes(max);
  });
});
