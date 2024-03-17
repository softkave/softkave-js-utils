import {compact} from 'lodash';
import {convertToArray} from './convertToArray';

/**
 * Returns an array without falsy values like `false`, `null`, `0`, `""`,
 * `undefined`, and `NaN`
 */
export function toCompactArray<T>(...args: Array<T | T[]>) {
  const array = convertToArray(...args);
  return compact(array as Array<NonNullable<T> | undefined>);
}
