import {toCompactArray} from './toCompactArray';

/**
 * Returns 2nd argument if 1st argument is `null` or `undefined` or
 * `arguments[0].length === 0`
 *
 * ```typescript
 * const otherArr = ['other'];
 *
 * const arr01 = defaultToArray(undefined, other);
 * arr01 === otherArr;
 *
 * const arr02 = defaultToArray(null, other);
 * arr02 === otherArr;
 *
 * const arr03 = defaultToArray([], other);
 * arr03 === otherArr;
 *
 * const willNotEqualOtherArr = defaultToArray(['non-empty'], other);
 * willNotEqualOtherArr !== otherArr;
 * ```
 */
export function defaultArrayTo<T>(
  array: undefined | null | T[],
  data: NonNullable<T | T[]>
) {
  return array?.length ? array : toCompactArray(data);
}
