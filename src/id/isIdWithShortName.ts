import {kSoftkaveJsUtilsConstants} from '../constants';
import {IdOptions, IdShortNameMap} from './types';

export function isIdWithShortName(
  resourceId: string,
  opts: {shortNameMap: IdShortNameMap} & Pick<IdOptions, 'shortNameLength'>
) {
  const {
    shortNameMap,
    shortNameLength = kSoftkaveJsUtilsConstants.resource.shortNameLength,
  } = opts;
  const shortName = resourceId.slice(0, shortNameLength);

  if (!shortName ?? !shortNameMap[shortName]) {
    return false;
  }

  return true;
}
