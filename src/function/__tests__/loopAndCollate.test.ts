import {expect, test, vi} from 'vitest';
import {identityArgs} from '../identityArgs.js';
import {loopAndCollate} from '../loopAndCollate.js';

test('loopAndCollate', () => {
  const fn = vi.fn().mockImplementation(identityArgs);
  const max = 10;
  const extraArgs = [0, 1, 2];

  const result = loopAndCollate(fn, max, ...extraArgs);

  expect(fn).toHaveBeenCalledTimes(max);
  Array(max)
    .fill(0)
    .forEach((unused, index) => {
      const fnArgs = [index, ...extraArgs];
      const nthCallArgs = fn.mock.calls[index];
      expect(fnArgs).toEqual(nthCallArgs);
      expect(result[index]).toEqual(fnArgs);
    });
});
