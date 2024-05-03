import assert from 'assert';
import {isFunction, isString, isUndefined} from 'lodash-es';
import {AnyFn} from '../types.js';
import {assertErrorHasName} from './assertErrorHasName.js';

export async function expectErrorThrown(
  fn: AnyFn,
  expected?: string[] | AnyFn<[unknown], boolean | string | void>,
  finallyFn?: AnyFn
) {
  try {
    await fn();
    assert.fail('Error not thrown');
  } catch (error) {
    if (isFunction(expected)) {
      const assertionResult = expected(error);

      if (!isUndefined(assertionResult)) {
        assert(
          assertionResult === true,
          isString(assertionResult) ? assertionResult : 'Expectation not met'
        );
      }
    } else if (expected) {
      assertErrorHasName(error, expected);
    }
  } finally {
    if (finallyFn) {
      finallyFn();
    }
  }
}
