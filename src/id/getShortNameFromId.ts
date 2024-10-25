import {tryGetShortNameFromId} from './tryGetShortNameFromId.js';
import {IdOptions} from './types.js';

export function getShortNameFromId(
  id: string,
  opts: Pick<IdOptions, 'shortNameLength'> = {}
) {
  const shortName = tryGetShortNameFromId(id, opts);

  if (!shortName) {
    throw new Error(`Resource ID contains an invalid short name ${shortName}`);
  }

  return shortName;
}
