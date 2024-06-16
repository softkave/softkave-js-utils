import {isArray, isFunction, isString} from 'lodash-es';
import {ValueOf} from 'type-fest';
import {AnyFn} from '../types.js';

export const kCheckErrorHasMessageMatcher = {
  equal: 'equal',
  includes: 'includes',
} as const;

export type CheckErrorHasMessageMessage = string | RegExp;

export type CheckErrorHasMessageMatcherFn = AnyFn<
  [string, CheckErrorHasMessageMessage],
  boolean
>;

export type CheckErrorHasMessageMatcher =
  | ValueOf<typeof kCheckErrorHasMessageMatcher>
  | CheckErrorHasMessageMatcherFn;

const equalityMatcher: CheckErrorHasMessageMatcherFn = (m1, m2) =>
  isString(m2) ? m1 === m2 : m2.test(m1);

const includesMatcher: CheckErrorHasMessageMatcherFn = (m1, m2) =>
  isString(m2) ? m1.includes(m2) : m2.test(m1);

const noopMatcher: CheckErrorHasMessageMatcherFn = () => true;

export function checkErrorHasMessage(
  error: unknown,
  expectedErrorMessages:
    | CheckErrorHasMessageMessage
    | CheckErrorHasMessageMessage[],
  matcher: CheckErrorHasMessageMatcher = kCheckErrorHasMessageMatcher.includes,
  shouldMatchAtLeastOne = true
) {
  const errorList = isArray(error) ? error : [error];
  const matchedMessages: Array<CheckErrorHasMessageMessage> = [];
  const missingMessages: Array<CheckErrorHasMessageMessage> = [];
  const matcherFn = isFunction(matcher)
    ? matcher
    : matcher === 'equal'
      ? equalityMatcher
      : matcher === 'includes'
        ? includesMatcher
        : noopMatcher;

  expectedErrorMessages = isArray(expectedErrorMessages)
    ? expectedErrorMessages
    : [expectedErrorMessages];
  expectedErrorMessages.forEach(expectedMessage => {
    const matched = errorList.some(error =>
      matcherFn(error?.message, expectedMessage)
    );

    if (matched) {
      matchedMessages.push(expectedMessage);
    } else {
      missingMessages.push(expectedMessage);
    }
  });

  return {
    matchedMessages,
    missingMessages,
    matches:
      (shouldMatchAtLeastOne && matchedMessages.length > 0) ||
      missingMessages.length === 0,
  };
}
