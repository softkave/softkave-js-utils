import {compact} from 'lodash-es';

export function makeStringKey(
  parts: Array<string | number | undefined | null | boolean>,
  separator = '-',
  omitFalsy = true
) {
  if (omitFalsy) {
    parts = compact(parts);
  }

  return parts.join(separator);
}
