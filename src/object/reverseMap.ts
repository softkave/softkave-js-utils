import {cast} from '../other';
import {AnyObject} from '../types';

export function reverseMap<TRecord extends AnyObject>(inputMap: TRecord) {
  const reversedMap = cast<
    Record<Extract<keyof TRecord, string | number | symbol>, keyof TRecord>
  >({});

  for (const k in inputMap) {
    reversedMap[inputMap[k]] = k;
  }

  return reversedMap;
}
