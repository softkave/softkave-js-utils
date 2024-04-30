import {cast} from '../other/index.js';
import {AnyObject} from '../types.js';

export function reverseMap<TRecord extends AnyObject>(inputMap: TRecord) {
  const reversedMap = cast<
    Record<Extract<keyof TRecord, string | number | symbol>, keyof TRecord>
  >({});

  for (const k in inputMap) {
    reversedMap[inputMap[k]] = k;
  }

  return reversedMap;
}
