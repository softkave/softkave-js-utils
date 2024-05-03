import assert from 'assert';
import {isArray} from 'lodash-es';

export function assertErrorHasName(
  error: unknown,
  expectedErrorNames: string[]
) {
  const errorList = isArray(error) ? error : [error];
  const matchedTypes = expectedErrorNames.map(name =>
    errorList.find(item => item?.name === name)
  );
  const missingTypes: string[] = [];
  expectedErrorNames.forEach((name, i) => {
    if (!matchedTypes[i]) {
      missingTypes.push(name);
    }
  });

  const missingError = new Error(
    `${missingTypes.join(', ')} not found in \n${JSON.stringify(
      error,
      undefined,
      /** spaces */ 2
    )}`
  );

  assert(missingTypes.length === 0, missingError);
}
