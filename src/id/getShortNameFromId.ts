import {tryGetShortNameFromId} from './tryGetShortNameFromId';
import {IdOptions} from './types';

export function getShortNameFromId(
  id: string,
  opts: Pick<IdOptions, 'shortNameLength'>
) {
  const shortName = tryGetShortNameFromId(id, opts);

  if (!shortName) {
    throw new Error(`Resource ID contains an invalid short name ${shortName}`);
  }

  return shortName;
}
