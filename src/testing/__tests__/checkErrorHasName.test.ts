import {describe, expect, test} from 'vitest';
import {checkErrorHasName} from '../checkErrorHasName.js';

const kTestErrorName = 'Error';

class CustomError extends Error {
  constructor(name = kTestErrorName) {
    super();
    this.name = name;
  }
}

describe('checkErrorHasName', () => {
  test.each([
    // not matches
    {
      error: new CustomError(),
      names: ['NotFound'],
      shouldMatchAtLeastOne: false,
      matchedNames: [],
      missingNames: ['NotFound'],
      matches: false,
      msg: 'single error not found',
    },
    {
      error: new CustomError(),
      names: [kTestErrorName, 'NotFound'],
      shouldMatchAtLeastOne: false,
      matchedNames: [kTestErrorName],
      missingNames: ['NotFound'],
      matches: false,
      msg: 'single error not all found',
    },
    {
      error: [new CustomError(), new CustomError()],
      names: ['NotFound'],
      shouldMatchAtLeastOne: false,
      matchedNames: [],
      missingNames: ['NotFound'],
      matches: false,
      msg: 'error list not found',
    },
    {
      error: [new CustomError(), new CustomError()],
      names: [kTestErrorName, 'NotFound'],
      shouldMatchAtLeastOne: false,
      matchedNames: [kTestErrorName],
      missingNames: ['NotFound'],
      matches: false,
      msg: 'error list not all found',
    },

    // matches
    {
      error: new CustomError(),
      names: [kTestErrorName],
      shouldMatchAtLeastOne: true,
      matchedNames: [kTestErrorName],
      missingNames: [],
      matches: true,
      msg: 'single error found',
    },
    {
      error: new CustomError(),
      names: [kTestErrorName, 'NotFound'],
      shouldMatchAtLeastOne: true,
      matchedNames: [kTestErrorName],
      missingNames: ['NotFound'],
      matches: true,
      msg: 'shouldMatchAtLeastOne found',
    },
    {
      error: [new CustomError(), new CustomError('CustomError')],
      names: [kTestErrorName, 'CustomError'],
      shouldMatchAtLeastOne: true,
      matchedNames: [kTestErrorName, 'CustomError'],
      missingNames: [],
      matches: true,
      msg: 'error list found',
    },
    {
      error: [new CustomError(), new CustomError()],
      names: [kTestErrorName, 'NotFound'],
      shouldMatchAtLeastOne: true,
      matchedNames: [kTestErrorName],
      missingNames: ['NotFound'],
      matches: true,
      msg: 'error list shouldMatchAtLeastOne found',
    },
  ])(
    'not found $msg',
    ({
      error,
      names,
      matchedNames,
      missingNames,
      matches,
      shouldMatchAtLeastOne,
    }) => {
      const exp = checkErrorHasName(error, names, shouldMatchAtLeastOne);

      expect(exp.matches).toBe(matches);
      expect(exp.matchedNames).toEqual(matchedNames);
      expect(exp.missingNames).toEqual(missingNames);
    }
  );
});
