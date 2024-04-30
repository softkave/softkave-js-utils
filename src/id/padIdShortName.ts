import {kSoftkaveJsUtilsConstants} from '../constants.js';
import {IdOptions} from './types.js';

export function padIdShortName(
  shortName: string,
  opts: Pick<IdOptions, 'shortNameLength' | 'shortNamePaddingChar'> = {}
) {
  const {
    shortNameLength = kSoftkaveJsUtilsConstants.resource.shortNameLength,
    shortNamePaddingChar = kSoftkaveJsUtilsConstants.resource
      .shortNamePaddingChar,
  } = opts;

  if (shortName.length > shortNameLength) {
    throw new Error(
      `Resource short name is more than ${shortNameLength} characters`
    );
  }

  return shortName.padEnd(shortNameLength, shortNamePaddingChar).toLowerCase();
}
