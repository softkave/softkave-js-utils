import {compact, isArray, last} from 'lodash';
import path from 'path-browserify';
import {convertToArray} from '../array/index.js';

const kDefaultFolderSeparator = '/';

export function pathJoin(params: {
  input: string | string[] | Array<string | string[]>;
  separator?: string;
}) {
  const {input, separator = kDefaultFolderSeparator} = params;
  let pJoined = path.posix.join(
    ...convertToArray(input).map(arg =>
      isArray(arg) ? arg.join(separator) : arg
    )
  );

  if (pJoined.match(/^[./]*$/) || !pJoined) {
    return '';
  }

  if (pJoined[0] !== separator) {
    pJoined = separator + pJoined;
  }

  if (pJoined[pJoined.length - 1] === separator) {
    pJoined = pJoined.slice(0, -1);
  }

  return pJoined;
}

export function pathSplit(params: {
  input: string | string[];
  separator?: string;
}) {
  const {input = '', separator = kDefaultFolderSeparator} = params;
  return compact(pathJoin({separator, input: input}).split(separator));
}

export function isPathEmpty(params: {
  input: string | string[];
  separator?: string;
}) {
  const {input, separator = kDefaultFolderSeparator} = params;
  const pJoined = pathJoin({separator, input: [input, 'E']});
  return pJoined === '/E';
}

export function pathExtension(params: {input: string; separator?: string}) {
  const name = last(pathSplit(params));
  return path.extname(name || '').replace('.', '');
}

export function pathBasename(params: {input: string; separator?: string}) {
  const {separator = kDefaultFolderSeparator} = params;
  const name = last(pathSplit(params)) || '';
  const ext = pathExtension({separator, input: name});
  let basename = path.posix.basename(name, `.${ext}`);

  if (basename.match(/^[.]*$/)) {
    basename = '';
  }

  return {basename, ext};
}
