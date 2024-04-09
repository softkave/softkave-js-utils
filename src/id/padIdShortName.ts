import {kSoftkaveJsUtilsConstants} from '../constants';
import {IdOptions} from './types';

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
