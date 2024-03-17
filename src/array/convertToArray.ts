import {flatten} from 'lodash';

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
