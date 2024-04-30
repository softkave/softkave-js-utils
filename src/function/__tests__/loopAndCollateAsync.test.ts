import assert from 'assert';
import {describe, expect, test, vi} from 'vitest';
import {waitTimeout} from '../../other/index.js';
import {expectErrorThrown} from '../../testing/expectErrorThrown.js';
import {identityArgs} from '../identityArgs.js';
import {loopAndCollateAsync} from '../loopAndCollateAsync.js';

describe('fns', () => {
  test('loopAndCollateAsync, oneByOne', async () => {
    const max = 10;
    const fn = vi.fn().mockImplementation(identityArgs);
    const extraArgs = [0, 1, 2];

    const result = await loopAndCollateAsync(fn, max, 'oneByOne', ...extraArgs);

    expect(fn).toHaveBeenCalledTimes(max);
    Array(max)
      .fill(0)
      .forEach((unused, index) => {
        const fnArgs = [index, ...extraArgs];
        const nthCallArgs = fn.mock.calls[index];
        expect(fnArgs).toEqual(nthCallArgs);
        expect(result[index]).toEqual(fnArgs);
      });

    // There should be only 1 invocation if error is thrown
    const fnThrows = vi.fn().mockImplementation(() => {
      throw new Error();
    });

    await expectErrorThrown(async () => {
      await loopAndCollateAsync(fnThrows, max, 'oneByOne', ...extraArgs);
    });

    expect(fnThrows).toHaveBeenCalledTimes(1);
  });

  test('loopAndCollateAsync, all', async () => {
    const max = 10;
    const fn = vi.fn().mockImplementation(identityArgs);
    const extraArgs = [0, 1, 2];

    const result = await loopAndCollateAsync(fn, max, 'all', ...extraArgs);

    expect(fn).toHaveBeenCalledTimes(max);
    Array(max)
      .fill(0)
      .forEach((unused, index) => {
        const fnArgs = [index, ...extraArgs];
        const nthCallArgs = fn.mock.calls[index];
        expect(fnArgs).toEqual(nthCallArgs);
        expect(result[index]).toEqual(fnArgs);
      });

    // There should be only `max` invocations even if error is thrown
    const fnThrows = vi.fn().mockImplementation(async () => {
      await waitTimeout(0);
      throw new Error();
    });

    await expectErrorThrown(async () => {
      await loopAndCollateAsync(fnThrows, max, 'all', ...extraArgs);
    });

    expect(fnThrows).toHaveBeenCalledTimes(max);
  });

  test('loopAndCollateAsync, allSettled', async () => {
    const max = 10;
    const fn = vi.fn().mockImplementation(identityArgs);
    const extraArgs = [0, 1, 2];

    const result = await loopAndCollateAsync(
      fn,
      max,
      'allSettled',
      ...extraArgs
    );

    expect(fn).toHaveBeenCalledTimes(max);
    Array(max)
      .fill(0)
      .forEach((unused, index) => {
        const indexResult = result[index];
        const fnArgs = [index, ...extraArgs];
        const nthCallArgs = fn.mock.calls[index];
        expect(fnArgs).toEqual(nthCallArgs);
        assert(indexResult.status === 'fulfilled');
        expect(indexResult.value).toEqual(fnArgs);
      });

    // There should be only `max` invocations even if error is thrown
    const fnThrows = vi.fn().mockImplementation(async () => {
      await waitTimeout(0);
      throw new Error();
    });

    // Should not throw outside of function even if `fn` throws error
    const resultsWithError = await loopAndCollateAsync(
      fnThrows,
      max,
      'allSettled',
      ...extraArgs
    );

    expect(fnThrows).toHaveBeenCalledTimes(max);
    expect(resultsWithError).toHaveLength(max);
    resultsWithError.forEach((result, index) => {
      if (index === 0) {
        expect(result.status === 'fulfilled');
      } else {
        expect(result.status === 'rejected');
      }
    });
  });
});
