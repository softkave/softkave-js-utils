import {nanoid} from 'nanoid';
import {kSoftkaveJsUtilsConstants} from '../constants';
import {IdOptions} from './types';

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
