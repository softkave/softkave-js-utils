import {last} from 'lodash-es';
import {Primitive} from 'type-fest';
import {isObjectEmpty} from '../object/index.js';
import {AnyObject} from '../types.js';

type Key = Array<string | number>;
type KeyType = Array<'string' | 'number'>;
type Value = Primitive;
type IndexedJson = Record<
  string,
  {
    key: Key;
    value: Value[];
    keyType: KeyType;
    valueType: Set<string>;
  }
>;

export interface IIndexJsonOptions {
  /**
   * If true, values sub-indexed within numeric keys will be attributed also to
   * the parent key.
   *
   * @example
   * ```ts
   * const json = {
   *   a: [
   *     {
   *       b: 1,
   *     },
   *     {
   *       b: 2,
   *     },
   *   ],
   * }
   *
   * indexJson(json, undefined, undefined, {flattenNumericKeys: true})
   *
   * // Result:
   * // {
   * //   'a.0.b': {
   * //     key: ['a', '0', 'b'],
   * //     value: [1],
   * //     keyType: ['string', 'number', 'string'],
   * //     valueType: new Set(['number']),
   * //   },
   * //   'a.1.b': {
   * //     key: ['a', '1', 'b'],
   * //     value: [2],
   * //     keyType: ['string', 'number', 'string'],
   * //     valueType: new Set(['number']),
   * //   },
   * //   "a.b": {
   * //     key: ['a', 'b'],
   * //     value: [1, 2],
   * //     keyType: ['string', 'string'],
   * //     valueType: new Set(['number']),
   * //   },
   * // }
   *
   * indexJson(json, undefined, undefined, {flattenNumericKeys: false})
   *
   * // Result:
   * // {
   * //   'a.0.b': {
   * //     key: ['a', '0', 'b'],
   * //     value: [1],
   * //     keyType: ['string', 'number', 'string'],
   * //     valueType: new Set(['number']),
   * //   },
   * //   'a.1.b': {
   * //     key: ['a', '1', 'b'],
   * //     value: [2],
   * //     keyType: ['string', 'number', 'string'],
   * //     valueType: new Set(['number']),
   * //   },
   * // }
   * ```
   * @default false
   */
  flattenNumericKeys?: boolean;
}

function getValueType(value: Value): string {
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  return typeof value;
}

function ensureEntries(indexed: IndexedJson, keyList: Key[]) {
  keyList.forEach(key => {
    const keyString = key.join('.');
    if (!indexed[keyString]) {
      indexed[keyString] = {
        key,
        keyType: key.map(k => typeof k as 'string' | 'number'),
        value: [],
        valueType: new Set<string>(),
      };
    }
  });
}

function indexKV(
  indexed: IndexedJson,
  key: Key,
  keyString: string,
  value: Value
): IndexedJson {
  if (indexed[keyString]) {
    indexed[keyString].value.push(value);
    indexed[keyString].valueType.add(getValueType(value));
  } else {
    indexed[keyString] = {
      key,
      keyType: key.map(k => typeof k as 'string' | 'number'),
      value: [value],
      valueType: new Set([getValueType(value)]),
    };
  }

  return indexed;
}

function indexPrimitive(
  indexed: IndexedJson,
  keyList: Key[],
  keyStringList: string[] | undefined,
  value: Value
): IndexedJson {
  keyList.forEach((key, index) => {
    const keyString = keyStringList?.[index] ?? key.join('.');
    indexKV(indexed, key, keyString, value);
  });

  return indexed;
}

function indexArray(
  indexed: IndexedJson,
  keyList: Key[],
  value: unknown[],
  options: IIndexJsonOptions
): IndexedJson {
  const lastKey = last(keyList) as Key;
  if (isObjectEmpty(value as AnyObject)) {
    ensureEntries(indexed, keyList);
  }

  value.forEach((item, index) => {
    const indexKeyList = options.flattenNumericKeys
      ? keyList.concat([lastKey.concat(index)])
      : [lastKey.concat(index)];

    if (Array.isArray(item)) {
      indexed = indexArray(indexed, indexKeyList, item, options);
    } else if (typeof item === 'object' && item !== null) {
      indexed = indexJson(item, options, {
        parentKeyList: indexKeyList,
        indexed,
      });
    } else {
      indexed = indexPrimitive(indexed, indexKeyList, undefined, item as Value);
    }
  });

  return indexed;
}

export function indexJson(
  json: AnyObject,
  options: IIndexJsonOptions = {},
  __internal: {
    parentKeyList: Array<Key>;
    indexed: IndexedJson;
  } = {
    parentKeyList: [],
    indexed: {},
  }
): IndexedJson {
  const {parentKeyList, indexed} = __internal;

  if (isObjectEmpty(json)) {
    ensureEntries(indexed, parentKeyList);
  }

  for (const key in json) {
    const currentKeyList = parentKeyList.length
      ? parentKeyList.map(parentKey => parentKey.concat(key))
      : [[key]];

    if (Array.isArray(json[key])) {
      indexArray(indexed, currentKeyList, json[key], options);
    } else if (typeof json[key] === 'object' && json[key] !== null) {
      indexJson(json[key], options, {
        parentKeyList: currentKeyList,
        indexed,
      });
    } else {
      indexPrimitive(indexed, currentKeyList, undefined, json[key]);
    }
  }

  return indexed;
}
