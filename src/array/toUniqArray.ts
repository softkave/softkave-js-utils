import {uniq} from 'lodash';
import {convertToArray} from './convertToArray';

export function toUniqArray<T>(...args: Array<T | T[]>) {
  const array = convertToArray(...args);
  return uniq(array);
}
