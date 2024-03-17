import {nanoid} from 'nanoid';
import {kSoftkaveJsUtilsConstants} from '../constants';
import {IdOptions} from './types';

export function getNewId(opts: Pick<IdOptions, 'nanoidLength'> = {}) {
  const {nanoidLength = kSoftkaveJsUtilsConstants.resource.nanoidLength} = opts;
  return nanoid(nanoidLength);
}
