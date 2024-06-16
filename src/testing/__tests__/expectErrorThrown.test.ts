import assert from 'assert';
import {noop} from 'lodash-es';
import {afterEach, describe, expect, test, vi} from 'vitest';
import {
  expectErrorThrownAsync,
  expectErrorThrownSync,
} from '../expectErrorThrown.js';

describe('expectErrorThrown', () => {
  const expectFn = vi
    .fn()
    .mockImplementation((error: unknown) => error instanceof Error);
  const finallyFn = vi.fn();

  afterEach(() => {
    expectFn.mockClear();
    finallyFn.mockClear();
  });

  test('error not thrown sync', () => {
    try {
      expectErrorThrownSync(noop, /** expected */ undefined, finallyFn);
      assert.fail();
    } catch (error) {
      // do nothing
    }

    expect(finallyFn).toHaveBeenCalled();
  });

  test('error not thrown async', async () => {
    try {
      await expectErrorThrownAsync(noop, /** expected */ undefined, finallyFn);
      assert.fail();
    } catch (error) {
      // do nothing
    }

    expect(finallyFn).toHaveBeenCalled();
  });

  test.each([
    {
      finallyFn,
      fn: () => {
        throw new Error('Error');
      },
      expected: {expectFn, name: 'Error', message: 'Error'},
      msg: 'with expected',
    },
  ])('error thrown sync $msg', ({fn, expected, finallyFn}) => {
    expectErrorThrownSync(fn, expected, finallyFn);

    expect(expectFn).toHaveBeenCalled();
    expect(finallyFn).toHaveBeenCalled();
  });

  test.each([
    {
      finallyFn,
      fn: () => {
        throw new Error('Error');
      },
      expected: {expectFn, name: 'Error', message: 'Error'},
      msg: 'with expected',
    },
  ])('error thrown sync $msg', async ({fn, expected, finallyFn}) => {
    await expectErrorThrownAsync(fn, expected, finallyFn);
    expect(expectFn).toHaveBeenCalled();
    expect(finallyFn).toHaveBeenCalled();
  });
});
