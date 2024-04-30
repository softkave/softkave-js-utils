import {nanoid} from 'nanoid';
import {kSoftkaveJsUtilsConstants} from '../constants.js';
import {IdOptions} from './types.js';

export function getNewId(opts: Pick<IdOptions, 'nanoidLength'> = {}) {
  const {nanoidLength = kSoftkaveJsUtilsConstants.resource.nanoidLength} = opts;
  return nanoid(nanoidLength);
}
