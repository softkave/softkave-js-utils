import {kSoftkaveJsUtilsConstants} from '../constants';
import {IdOptions} from './types';

export function getId0(
  opts: Pick<IdOptions, 'nanoidLength' | 'shortNamePaddingChar'>
) {
  const {
    nanoidLength = kSoftkaveJsUtilsConstants.resource.nanoidLength,
    shortNamePaddingChar = kSoftkaveJsUtilsConstants.resource
      .shortNamePaddingChar,
  } = opts;
  return ''.padEnd(nanoidLength, shortNamePaddingChar);
}
