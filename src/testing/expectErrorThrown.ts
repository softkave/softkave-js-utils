import assert from 'assert';
import {isFunction, isString, isUndefined} from 'lodash-es';
import {AnyFn} from '../types.js';
import {
  CheckErrorHasMessageMatcherFn,
  CheckErrorHasMessageMessage,
  checkErrorHasMessage,
} from './checkErrorHasMessage.js';
import {checkErrorHasName} from './checkErrorHasName.js';

export function checkExpected(
  error: unknown,
  expected?: {
    name?: string | string[];
    message?: CheckErrorHasMessageMessage | CheckErrorHasMessageMessage[];
    messageMatcher?: CheckErrorHasMessageMatcherFn;
    shouldMatchAtLeastOne?: boolean;
    expectFn?: AnyFn<[unknown], boolean | string | void>;
  }
) {
  if (expected?.expectFn && isFunction(expected?.expectFn)) {
    const assertion = expected.expectFn(error);

    if (!isUndefined(assertion)) {
      assert(
        assertion === true,
        isString(assertion) ? assertion : 'Expectation not met'
      );
    }
  }

  if (expected?.name) {
    const assertion = checkErrorHasName(
      error,
      expected.name,
      expected.shouldMatchAtLeastOne
    );

    assert(
      assertion.matches,
      `Missing errors names: ${JSON.stringify(assertion.missingNames)}`
    );
  }

  if (expected?.message) {
    const assertion = checkErrorHasMessage(
      error,
      expected.message,
      expected.messageMatcher,
      expected.shouldMatchAtLeastOne
    );

    assert(
      assertion.matches,
      `Missing errors messages: ${JSON.stringify(assertion.missingMessages)}`
    );
  }
}

export function expectErrorThrownSync(
  fn: AnyFn,
  expected?: {
    name?: string | string[];
    message?: CheckErrorHasMessageMessage | CheckErrorHasMessageMessage[];
    messageMatcher?: CheckErrorHasMessageMatcherFn;
    shouldMatchAtLeastOne?: boolean;
    expectFn?: AnyFn<[unknown], boolean | string | void>;
  },
  finallyFn?: AnyFn
) {
  try {
    fn();
    assert.fail('Error not thrown');
  } catch (error) {
    checkExpected(error, expected);
  } finally {
    if (finallyFn) {
      finallyFn();
    }
  }
}

export async function expectErrorThrownAsync(
  fn: AnyFn,
  expected?: {
    name?: string | string[];
    message?: CheckErrorHasMessageMessage | CheckErrorHasMessageMessage[];
    messageMatcher?: CheckErrorHasMessageMatcherFn;
    shouldMatchAtLeastOne?: boolean;
    expectFn?: AnyFn<[unknown], boolean | string | void>;
  },
  finallyFn?: AnyFn
) {
  try {
    await fn();
    assert.fail('Error not thrown');
  } catch (error) {
    checkExpected(error, expected);
  } finally {
    if (finallyFn) {
      finallyFn();
    }
  }
}
