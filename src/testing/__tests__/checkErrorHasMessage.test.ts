import {isFunction, isRegExp, isString} from 'lodash-es';
import {ValueOf} from 'type-fest';
import {describe, expect, test} from 'vitest';
import {
  CheckErrorHasMessageMatcher,
  CheckErrorHasMessageMessage,
  checkErrorHasMessage,
  kCheckErrorHasMessageMatcher,
} from '../checkErrorHasMessage.js';

const kExtraFoundTestMessages = {
  found: 'Found',
  error: 'Error',
};

const kExtraFoundTestRegExps = {
  found: /Found/,
  error: /Error/,
};

const kExtraNotFoundTestMessages = {
  notFound: 'NotFound',
};

const kExtraNotFoundTestRegExps = {
  notFound: /NotFound/,
};

const kFoundTestMessages: Record<
  ValueOf<typeof kCheckErrorHasMessageMatcher>,
  string
> = {
  [kCheckErrorHasMessageMatcher.equal]: 'Error',
  [kCheckErrorHasMessageMatcher.includes]: 'Err',
};

const kNotFoundTestMessages: Record<
  ValueOf<typeof kCheckErrorHasMessageMatcher>,
  string
> = {
  [kCheckErrorHasMessageMatcher.equal]: kExtraNotFoundTestMessages.notFound,
  [kCheckErrorHasMessageMatcher.includes]: 'NotF',
};

const kFoundMessageAndRegExpList = ([] as CheckErrorHasMessageMessage[]).concat(
  Object.values(kExtraFoundTestMessages),
  Object.values(kExtraFoundTestRegExps)
);

function getExpectedErrorMessage(
  messages: typeof kFoundTestMessages,
  matcher: CheckErrorHasMessageMatcher | RegExp
) {
  return isRegExp(matcher) || isFunction(matcher)
    ? messages.equal
    : messages[matcher];
}

const matchFound: CheckErrorHasMessageMatcher = (m1, m2) => {
  return kFoundMessageAndRegExpList.some(message => message === m2);
};

const matchNotFound: CheckErrorHasMessageMatcher = () => false;

class CustomError extends Error {
  constructor(message = kExtraFoundTestMessages.error) {
    super(message);
  }
}

describe('checkErrorHasMessage', () => {
  test.each([
    // #region not matches, single
    ...[
      kCheckErrorHasMessageMatcher.equal,
      kCheckErrorHasMessageMatcher.includes,
      matchNotFound,
      kExtraNotFoundTestRegExps.notFound,
    ].map(matcher => ({
      matcher: isRegExp(matcher) ? kCheckErrorHasMessageMatcher.equal : matcher,
      error: new CustomError(),
      expectedErrorMessages: getExpectedErrorMessage(
        kNotFoundTestMessages,
        matcher
      ),
      shouldMatchAtLeastOne: false,
      matchedMessages: [],
      missingMessages: [
        getExpectedErrorMessage(kNotFoundTestMessages, matcher),
      ],
      matches: false,
      msg: `single error not found with ${
        isString(matcher) ? matcher : isRegExp(matcher) ? 'regexp' : 'fn'
      }`,
    })),
    // #endregion

    // #region not matches, not all found
    ...[
      kCheckErrorHasMessageMatcher.equal,
      kCheckErrorHasMessageMatcher.includes,
      matchFound,
      kExtraNotFoundTestRegExps.notFound,
    ].map(matcher => ({
      matcher: isRegExp(matcher) ? kCheckErrorHasMessageMatcher.equal : matcher,
      error: new CustomError(),
      expectedErrorMessages: [
        getExpectedErrorMessage(kNotFoundTestMessages, matcher),
        kExtraFoundTestMessages.error,
      ],
      shouldMatchAtLeastOne: false,
      matchedMessages: [kExtraFoundTestMessages.error],
      missingMessages: [
        getExpectedErrorMessage(kNotFoundTestMessages, matcher),
      ],
      matches: false,
      msg: `single error not all found with ${
        isString(matcher) ? matcher : isRegExp(matcher) ? 'regexp' : 'fn'
      }`,
    })),
    // #endregion

    // #region not matches, list
    ...[
      kCheckErrorHasMessageMatcher.equal,
      kCheckErrorHasMessageMatcher.includes,
      matchNotFound,
      kExtraNotFoundTestRegExps.notFound,
    ].map(matcher => ({
      matcher: isRegExp(matcher) ? kCheckErrorHasMessageMatcher.equal : matcher,
      error: [new CustomError(), new CustomError()],
      expectedErrorMessages: getExpectedErrorMessage(
        kNotFoundTestMessages,
        matcher
      ),
      shouldMatchAtLeastOne: false,
      matchedMessages: [],
      missingMessages: [
        getExpectedErrorMessage(kNotFoundTestMessages, matcher),
      ],
      matches: false,
      msg: `list error not found with ${
        isString(matcher) ? matcher : isRegExp(matcher) ? 'regexp' : 'fn'
      }`,
    })),
    // #endregion

    // #region not matches, not all found list
    ...[
      kCheckErrorHasMessageMatcher.equal,
      kCheckErrorHasMessageMatcher.includes,
      matchFound,
      kExtraNotFoundTestRegExps.notFound,
    ].map(matcher => ({
      matcher: isRegExp(matcher) ? kCheckErrorHasMessageMatcher.equal : matcher,
      error: [
        new CustomError(),
        new CustomError(kExtraFoundTestMessages.found),
      ],
      expectedErrorMessages: [
        getExpectedErrorMessage(kNotFoundTestMessages, matcher),
        kExtraFoundTestMessages.error,
        kExtraFoundTestRegExps.found,
      ],
      shouldMatchAtLeastOne: false,
      matchedMessages: [
        kExtraFoundTestMessages.error,
        kExtraFoundTestRegExps.found,
      ],
      missingMessages: [
        getExpectedErrorMessage(kNotFoundTestMessages, matcher),
      ],
      matches: false,
      msg: `list error not all found with ${
        isString(matcher) ? matcher : isRegExp(matcher) ? 'regexp' : 'fn'
      }`,
    })),
    // #endregion

    // #region matches, single
    ...[
      kCheckErrorHasMessageMatcher.equal,
      kCheckErrorHasMessageMatcher.includes,
      matchFound,
      kExtraFoundTestRegExps.found,
    ].map(matcher => ({
      matcher: isRegExp(matcher) ? kCheckErrorHasMessageMatcher.equal : matcher,
      error: new CustomError(),
      expectedErrorMessages: [
        getExpectedErrorMessage(kFoundTestMessages, matcher),
      ],
      shouldMatchAtLeastOne: true,
      matchedMessages: [getExpectedErrorMessage(kFoundTestMessages, matcher)],
      missingMessages: [],
      matches: true,
      msg: `single error found with ${
        isString(matcher) ? matcher : isRegExp(matcher) ? 'regexp' : 'fn'
      }`,
    })),
    // #endregion

    // #region matches, not all found
    ...[
      kCheckErrorHasMessageMatcher.equal,
      kCheckErrorHasMessageMatcher.includes,
      matchFound,
      kExtraFoundTestRegExps.found,
    ].map(matcher => ({
      matcher: isRegExp(matcher) ? kCheckErrorHasMessageMatcher.equal : matcher,
      error: new CustomError(),
      expectedErrorMessages: [
        getExpectedErrorMessage(kFoundTestMessages, matcher),
        kExtraNotFoundTestRegExps.notFound,
        kExtraNotFoundTestMessages.notFound,
      ],
      shouldMatchAtLeastOne: true,
      matchedMessages: [getExpectedErrorMessage(kFoundTestMessages, matcher)],
      missingMessages: [
        kExtraNotFoundTestRegExps.notFound,
        kExtraNotFoundTestMessages.notFound,
      ],
      matches: true,
      msg: `single error all found with ${
        isString(matcher) ? matcher : isRegExp(matcher) ? 'regexp' : 'fn'
      }`,
    })),
    // #endregion

    // #region matches, list
    ...[
      kCheckErrorHasMessageMatcher.equal,
      kCheckErrorHasMessageMatcher.includes,
      matchFound,
      kExtraFoundTestRegExps.found,
    ].map(matcher => ({
      matcher: isRegExp(matcher) ? kCheckErrorHasMessageMatcher.equal : matcher,
      error: [
        new CustomError(),
        new CustomError(kExtraFoundTestMessages.found),
      ],
      expectedErrorMessages: [
        getExpectedErrorMessage(kFoundTestMessages, matcher),
        kExtraFoundTestRegExps.found,
      ],
      shouldMatchAtLeastOne: true,
      matchedMessages: [
        getExpectedErrorMessage(kFoundTestMessages, matcher),
        kExtraFoundTestRegExps.found,
      ],
      missingMessages: [],
      matches: true,
      msg: `list error found with ${
        isString(matcher) ? matcher : isRegExp(matcher) ? 'regexp' : 'fn'
      }`,
    })),
    // #endregion

    // #region matches, not all found list
    ...[
      kCheckErrorHasMessageMatcher.equal,
      kCheckErrorHasMessageMatcher.includes,
      matchFound,
      kExtraFoundTestRegExps.found,
    ].map(matcher => ({
      matcher: isRegExp(matcher) ? kCheckErrorHasMessageMatcher.equal : matcher,
      error: [new CustomError(), new CustomError()],
      expectedErrorMessages: [
        getExpectedErrorMessage(kFoundTestMessages, matcher),
        kExtraNotFoundTestRegExps.notFound,
        kExtraNotFoundTestMessages.notFound,
      ],
      shouldMatchAtLeastOne: true,
      matchedMessages: [getExpectedErrorMessage(kFoundTestMessages, matcher)],
      missingMessages: [
        kExtraNotFoundTestRegExps.notFound,
        kExtraNotFoundTestMessages.notFound,
      ],
      matches: true,
      msg: `list error all found with ${
        isString(matcher) ? matcher : isRegExp(matcher) ? 'regexp' : 'fn'
      }`,
    })),
    // #endregion
  ])(
    'match $msg',
    ({
      error,
      expectedErrorMessages,
      matchedMessages,
      missingMessages,
      matches,
      shouldMatchAtLeastOne,
      matcher,
    }) => {
      const exp = checkErrorHasMessage(
        error,
        expectedErrorMessages,
        matcher,
        shouldMatchAtLeastOne
      );

      expect(exp.matches).toBe(matches);
      expect(exp.matchedMessages).toEqual(matchedMessages);
      expect(exp.missingMessages).toEqual(missingMessages);
    }
  );
});
