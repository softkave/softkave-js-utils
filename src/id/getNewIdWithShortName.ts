import {nanoid} from 'nanoid';
import {kSoftkaveJsUtilsConstants} from '../constants.js';
import {IdOptions} from './types.js';

// TODO: write validation schema/regex
export function getNewIdWithShortName(
  shortName: string,
  opts: {id?: string} & Pick<
    IdOptions,
    'nanoidLength' | 'shortNamePaddingChar' | 'shortNameIdSeparator'
  > = {}
) {
  const {
    nanoidLength = kSoftkaveJsUtilsConstants.resource.nanoidLength,
    id = nanoid(nanoidLength),
    shortNameIdSeparator = kSoftkaveJsUtilsConstants.resource
      .shortNameIdSeparator,
  } = opts;
  return `${shortName}${shortNameIdSeparator}${id}`;
}
