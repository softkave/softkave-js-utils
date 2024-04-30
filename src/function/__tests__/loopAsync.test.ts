import {describe, expect, test, vi} from 'vitest';
import {waitTimeout} from '../../other/index.js';
import {expectErrorThrown} from '../../testing/expectErrorThrown.js';
import {loopAsync} from '../loopAsync.js';

describe('fns', () => {
  test('loopAsync, oneByOne', async () => {
    const max = 10;
    const fn = vi.fn();
    const extraArgs = [0, 1, 2];

    await loopAsync(fn, max, 'oneByOne', ...extraArgs);

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

    await expectErrorThrown(async () => {
      await loopAsync(fnThrows, max, 'oneByOne', ...extraArgs);
    });

    expect(fnThrows).toHaveBeenCalledTimes(1);
  });

  test('loopAsync, all', async () => {
    const max = 10;
    const fn = vi.fn();
    const extraArgs = [0, 1, 2];

    await loopAsync(fn, max, 'all', ...extraArgs);

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

    await expectErrorThrown(async () => {
      await loopAsync(fnThrows, max, 'all', ...extraArgs);
    });

    expect(fnThrows).toHaveBeenCalledTimes(max);
  });

  test('loopAsync, allSettled', async () => {
    const max = 10;
    const fn = vi.fn();
    const extraArgs = [0, 1, 2];

    await loopAsync(fn, max, 'allSettled', ...extraArgs);

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
    await loopAsync(fnThrows, max, 'allSettled', ...extraArgs);

    expect(fnThrows).toHaveBeenCalledTimes(max);
  });
});
