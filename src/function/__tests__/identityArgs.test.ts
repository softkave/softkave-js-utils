import {faker} from '@faker-js/faker';
import {expect, test} from 'vitest';
import {identityArgs} from '../identityArgs.js';

test('identityArgs', () => {
  const args = Array(2).fill(faker.number.int());

  const result = identityArgs(...args);

  expect(args).toEqual(result);
});
