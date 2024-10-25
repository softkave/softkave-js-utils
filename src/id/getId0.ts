import {kSoftkaveJsUtilsConstants} from '../constants.js';
import {IdOptions} from './types.js';

export function getId0(
  opts: Pick<IdOptions, 'nanoidLength' | 'shortNamePaddingChar'> = {}
) {
  const {
    nanoidLength = kSoftkaveJsUtilsConstants.resource.nanoidLength,
    shortNamePaddingChar = kSoftkaveJsUtilsConstants.resource
      .shortNamePaddingChar,
  } = opts;
  return ''.padEnd(nanoidLength, shortNamePaddingChar);
}
