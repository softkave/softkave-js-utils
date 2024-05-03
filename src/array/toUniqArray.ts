import {uniq} from 'lodash-es';
import {convertToArray} from './convertToArray.js';

export function toUniqArray<T>(...args: Array<T | T[]>) {
  const array = convertToArray(...args);
  return uniq(array);
}
