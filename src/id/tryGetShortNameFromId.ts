import {kSoftkaveJsUtilsConstants} from '../constants.js';
import {IdOptions} from './types.js';

export function tryGetShortNameFromId(
  id: string,
  opts: Pick<IdOptions, 'shortNameLength'> = {}
): string | undefined {
  const {shortNameLength = kSoftkaveJsUtilsConstants.resource.shortNameLength} =
    opts;
  const shortName = id.slice(0, shortNameLength);
  return shortName;
}
