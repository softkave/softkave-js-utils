import {isArray} from 'lodash-es';

export function checkErrorHasName(
  error: unknown,
  expectedErrorNames: string | string[],
  shouldMatchAtLeastOne = true
) {
  const errorMap = (isArray(error) ? error : [error]).reduce(
    (acc, nextError) => {
      if (nextError?.name) {
        acc[nextError.name] = nextError.name;
      }

      return acc;
    },
    {} as Record<string, string>
  );

  const matchedNames: string[] = [];
  const missingNames: string[] = [];

  expectedErrorNames = isArray(expectedErrorNames)
    ? expectedErrorNames
    : [expectedErrorNames];
  expectedErrorNames.forEach(name => {
    if (errorMap[name]) {
      matchedNames.push(name);
    } else {
      missingNames.push(name);
    }
  });

  return {
    matchedNames,
    missingNames,
    matches:
      (shouldMatchAtLeastOne && matchedNames.length > 0) ||
      missingNames.length === 0,
  };
}
