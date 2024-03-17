import {AnyObject} from '../types';

export function isObjectFieldsEmpty<T extends AnyObject>(data: T) {
  for (const k in data) {
    if (data[k] !== undefined && data[k] !== null) {
      return false;
    }
  }

  return true;
}
