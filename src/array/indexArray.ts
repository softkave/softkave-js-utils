import {get} from 'lodash-es';
import {AnyObject, OrArray} from '../types.js';
import {convertToArray} from './convertToArray.js';

function defaultIndexer(data: unknown, path: OrArray<keyof object>) {
  if (path) {
    return get(data, path);
  }

  if (data && data.toString) {
    return data.toString();
  }

  return String(data);
}

function defaultReducer(data: unknown) {
  return data;
}

type InferPathType<T> = T extends AnyObject ? keyof T : undefined;

type IndexArrayOptionsWithIndexer<T> = {
  /** Function to use for indexing. At least, one of `path` or `indexer` must be
   * provided, though both can be provided */
  indexer: (
    /** Current item being iterated over */
    current: T,
    /** `path` provided with `indexArray()` */
    path: InferPathType<T>,
    /** Index of current item in `arr` */
    index: number,
    /** Array provided with `indexArray()` */
    arr: T[]
  ) => string;
};

type IndexArrayOptionsWithPath<T> = {
  /** Path string to use for indexing if `arr` is an object array. Also works
   * with lodash-like dot-separated paths, like `"outer.inner"` */
  path: InferPathType<T>;
};

export type IndexArrayOptions<T, TItem> = {
  /** Transformation function for each item iterated over. Final result for each
   * item will be the result of `reducer`, not initial items in `arr` provided
   * */
  reducer?: (
    /** Current item being iterated over */
    current: T,
    /** Index of current item in `arr` */
    index: number,
    /** Array provided with `indexArray()` */
    arr: T[],
    /** Existing indexed item for key */
    existingItem: TItem | undefined,
    /** Map */
    map: {[key: string]: TItem}
  ) => TItem;
} & (IndexArrayOptionsWithPath<T> | IndexArrayOptionsWithIndexer<T>);

/**
 * Indexes an array into an object
 *
 * ```typescript
 * // Index an array of JS literals
 * const literalRecord = indexArray([1, 2, 3], {indexer: current => current});
 * literalRecord === {1: 1, 2: 2, 3: 3};
 *
 * // Index and transform an array of JS literals
 * const literalRecordTransformed = indexArray([1, 2, 3], {
 *   indexer: current => current,
 *   reducer: (current, index) => current + index,
 * });
 * literalRecordTransformed === {1: 1, 2: 3, 3: 5};
 *
 * // Index an array of JS objects using `path`
 * const objRecordByPath = indexArray([{key: 'value01'}, {key: 'value02'}], {
 *   path: 'key',
 * });
 * objRecordByPath === {value01: {key: 'value01'}, value02: {key: 'value02'}};
 *
 * // Index and transform an array of JS object using `path`
 * const objRecordByPathTransformed = indexArray(
 *   [{key: 'value01'}, {key: 'value02'}],
 *   {path: 'key', reducer: current => current.key}
 * );
 * objRecordByPathTransformed === {value01: 'value01', value02: 'value02'};
 *
 * // Index an array of JS objects using an indexer
 * const objRecordByIndexer = indexArray([{key: 'value01'}, {key: 'value02'}], {
 *   indexer: current => current.key,
 * });
 * objRecordByIndexer === {value01: {key: 'value01'}, value02: {key: 'value02'}};
 *
 * // Index an array of JS objects using lodash-like dot-separated `path`
 * const objRecordByLodashPath = indexArray(
 *   [{key: {innerKey: ['value01']}}, {key: {innerKey: ['value02']}}],
 *   {path: 'key.innerKey.0'}
 * );
 * objRecordByLodashPath ===
 *   {
 *     value01: {key: {innerKey: ['value01']}},
 *     value02: {key: {innerKey: ['value02']}},
 *   };
 * ```
 */
export function indexArray<T, TItem = T>(
  /** Array to index */
  arr: T | T[] = [],
  opts: IndexArrayOptions<T, TItem>
): {[key: string]: TItem} {
  const array = convertToArray(arr ?? []);
  const indexer =
    (opts as IndexArrayOptionsWithIndexer<T>).indexer ?? defaultIndexer;
  const path = (opts as IndexArrayOptionsWithPath<T>).path;
  const reducer = opts.reducer ?? defaultReducer;

  if (typeof indexer !== 'function') {
    if (typeof path !== 'string') {
      return {};
    }
  }

  const result = array.reduce(
    (accumulator, current, index) => {
      const key = indexer(current, path, index, array);
      accumulator[key] = reducer(
        current,
        index,
        array,
        accumulator[key],
        accumulator
      ) as TItem;
      return accumulator;
    },
    {} as {[key: string]: TItem}
  );

  return result;
}
