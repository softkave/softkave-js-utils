import {get} from 'lodash';
import {AnyObject, OrArray} from '../types';
import {convertToArray} from './convertToArray';

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
  indexer: (
    current: T,
    path: InferPathType<T>,
    arr: T[],
    index: number
  ) => string;
};

type IndexArrayOptionsWithPath<T> = {path: InferPathType<T>};

export type IndexArrayOptions<T, TItem> = {
  reducer?: (current: T, arr: T[], index: number) => TItem;
} & (IndexArrayOptionsWithPath<T> | IndexArrayOptionsWithIndexer<T>);

export function indexArray<T, TItem = T>(
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
      const key = indexer(current, path, array, index);
      accumulator[key] = reducer(current, array, index) as TItem;
      return accumulator;
    },
    {} as {[key: string]: TItem}
  );

  return result;
}
