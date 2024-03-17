import {faker} from '@faker-js/faker';
import {identityArgs} from '../identityArgs';

test('identityArgs', () => {
  const args = Array(2).fill(faker.number.int());

  const result = identityArgs(...args);

  expect(args).toEqual(result);
});
