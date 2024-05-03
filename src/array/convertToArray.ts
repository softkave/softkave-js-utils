import {flatten} from 'lodash-es';

/**
 * Converts it's arguments to an array
 *
 * ```typescript
 * const arr = convertToArray(1, 'two', [3, 4], [[5, 6]]);
 * arr === [1, 'two', 3, 4, [5, 6]];
 *
 * const undefinedArr = convertToArray(undefined);
 * undefinedArr === [undefined];
 * ```
 */
export function convertToArray<T>(...args: Array<T | T[]>) {
  const arrays = args.map(item => {
    if (Array.isArray(item)) {
      return item;
    } else {
      return [item];
    }
  });
  return flatten(arrays);
}
