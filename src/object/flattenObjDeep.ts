import {AnyObject} from '../types.js';

export function flattenObjDeep(obj: AnyObject) {
  const stack: Array<[string, AnyObject]> = [['', obj]];
  const result: AnyObject = {};

  for (let next = stack.pop(); next; next = stack.pop()) {
    const [parentKey, currentObj] = next;

    for (const instanceKey in currentObj) {
      const instanceValue = currentObj[instanceKey];
      const completeInstanceKey = parentKey
        ? parentKey + '.' + instanceKey
        : instanceKey;

      if (typeof instanceValue === 'object') {
        stack.push([completeInstanceKey, instanceValue]);
      } else {
        result[completeInstanceKey] = instanceValue;
      }
    }
  }

  return result;
}
