import {mergeWith} from 'lodash-es';

export interface MergeObjectMeta {
  /**
   * Strategy for handling arrays during merge operations.
   *
   * - `merge` - Uses lodash's default merge behavior (merges arrays by index).
   * - `concat` - Concatenates source value to destination array.
   * - `replace` - Replaces destination array with source value.
   * - `retain` - Keeps the destination array unchanged.
   *
   * Note: These strategies only apply when the destination value is an array.
   * When the destination is not an array, lodash's default behavior applies.
   */
  arrayUpdateStrategy: 'merge' | 'concat' | 'replace' | 'retain';
}

/**
 * Deeply merges two objects with customizable array merging strategies.
 *
 * @template T1 - Type of the destination object
 * @template T2 - Type of the source object
 * @param dest - The destination object (will be mutated!)
 * @param source - The source object
 * @param meta - Options for merge behavior:
 *   - arrayUpdateStrategy:
 *     - 'merge': Uses lodash's default merge behavior (merges arrays by index).
 *     - 'concat': Concatenates source value to destination array.
 *     - 'replace': Replaces destination array with source value.
 *     - 'retain': Keeps the destination array unchanged.
 *
 * @returns The merged object (same reference as dest, mutated in place).
 *
 * ## Internal Considerations
 * - **Mutation:** The destination object (`dest`) is mutated in place. If you
 *   need to preserve the original, pass a deep clone.
 * - **Array Handling:**
 *   - Array strategies only apply when the destination value is an array.
 *   - For 'concat': Concatenates srcValue to the destination array.
 *   - For 'replace': Replaces the destination array with srcValue.
 *   - For 'retain': Keeps the destination array unchanged.
 *   - For 'merge': Falls through to lodash's default merge behavior.
 *   - When destination is not an array, lodash's default behavior applies.
 *     {@see https://lodash.com/docs/4.17.15#merge}
 * - **Null/Undefined:** No special handling - follows the array strategy rules
 *   above.
 *
 * ## Example
 * ```ts
 * mergeObjects({a: [1]}, {a: [2]}, {arrayUpdateStrategy: 'concat'}) // {a: [1,2]}
 * mergeObjects({a: [1]}, {a: [2]}, {arrayUpdateStrategy: 'replace'}) // {a: [2]}
 * mergeObjects({a: [1]}, {a: [2]}, {arrayUpdateStrategy: 'merge'}) // {a: [2,1]}
 * mergeObjects({a: [1]}, {a: null}, {arrayUpdateStrategy: 'concat'}) // {a: [1,null]}
 * mergeObjects({a: null}, {a: [2]}, {arrayUpdateStrategy: 'concat'}) // {a: [2]} (lodash default)
 * ```
 */
export const mergeObjects = <T1 = unknown, T2 = unknown>(
  dest: T1,
  source: T2,
  meta: MergeObjectMeta = {arrayUpdateStrategy: 'replace'}
) => {
  const result = mergeWith(dest, source, (destValue, srcValue) => {
    // Only apply array strategies when the destination value is an array
    if (Array.isArray(destValue)) {
      if (meta.arrayUpdateStrategy === 'concat') {
        return destValue.concat(srcValue);
      } else if (meta.arrayUpdateStrategy === 'replace') {
        return srcValue;
      } else if (meta.arrayUpdateStrategy === 'retain') {
        return destValue;
      }
    }

    // For 'merge' strategy or when dest is not an array, fall through to lodash's default
  });

  return result as T1 & T2;
};
