import assert from 'assert';
import {isArray, isObject} from 'lodash';
import {AnyFn, AnyObject} from '../types';

export function omitDeep<
  T extends AnyObject | unknown[],
  TResult = T extends unknown[] ? Partial<T[number]>[] : Partial<T>,
>(
  data: T,
  /** Called with value and key. Should return `true` to omit, and `false` to
   * keep. */
  omitFn: AnyFn<[unknown, keyof T], boolean>
): TResult {
  const result: AnyObject | undefined = isArray(data)
    ? ([] as AnyObject)
    : isObject(data)
    ? ({} as AnyObject)
    : undefined;
  assert(result);

  for (const key in data) {
    let value = data[key];

    if (!omitFn(value, key)) {
      if (isObject(value)) {
        value = omitDeep(value, omitFn);
      }

      result[key] = value;
    }
  }

  return result as TResult;
}
