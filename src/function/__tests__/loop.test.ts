import {loop} from '../loop';

test('loop', () => {
  const fn = jest.fn();
  const max = 10;
  const extraArgs = [0, 1, 2];

  loop(fn, max, ...extraArgs);

  expect(fn).toHaveBeenCalledTimes(max);
  Array(max)
    .fill(0)
    .forEach((unused, index) => {
      const fnArgs = [index, ...extraArgs];
      const nthCallArgs = fn.mock.calls[index];
      expect(fnArgs).toEqual(nthCallArgs);
    });
});
