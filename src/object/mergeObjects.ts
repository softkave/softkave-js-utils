import {mergeWith} from 'lodash';

export interface MergeObjectMeta {
  /**
   * `merge` - Lodash's default, check out Lodash's `mergeWith` for details.
   * `concat` - Joins both arrays, returning a new array.
   * `replace` - Replaces the old array with the new array value.
   * `retain` - Retains the old array value.
   */
  arrayUpdateStrategy: 'merge' | 'concat' | 'replace' | 'retain';
}

export const mergeObjects = <T1 = unknown, T2 = unknown>(
  dest: T1,
  source: T2,
  meta: MergeObjectMeta = {arrayUpdateStrategy: 'replace'}
) => {
  const result = mergeWith(dest, source, (objValue, srcValue) => {
    if (Array.isArray(objValue) && srcValue) {
      if (meta.arrayUpdateStrategy === 'concat') {
        return objValue.concat(srcValue);
      } else if (meta.arrayUpdateStrategy === 'replace') {
        return srcValue;
      } else if (meta.arrayUpdateStrategy === 'retain') {
        return objValue;
      }

      // No need to handle the "merge" arrayUpdateStrategy, it happens by
      // default if nothing is returned
    }
  });

  return result as T1 & T2;
};
