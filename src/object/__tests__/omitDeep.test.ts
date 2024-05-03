import {isArray, isNumber, isObject} from 'lodash-es';
import {expect, test} from 'vitest';
import {omitDeep} from '../omitDeep.js';

test('omitDeep', () => {
  const data = [
    {
      one: 1,
      obj: {
        two: 2,
        array: [
          {
            three: 3,
            innerObject: {
              four: 4,
            },
          },
        ],
      },
    },
  ];
  const expectedDataWithoutArrays = [
    {
      one: 1,
      obj: {
        two: 2,
      },
    },
  ];
  const expectedDataWithoutNumbers = [
    {
      obj: {
        array: [
          {
            innerObject: {},
          },
        ],
      },
    },
  ];
  const expectedDataWithoutObjects: unknown[] = [];

  const dataWithoutArrays = omitDeep(data, isArray);
  const dataWithoutObjects = omitDeep(data, isObject);
  const dataWithoutNumbers = omitDeep(data, isNumber);

  expect(dataWithoutArrays).toEqual(expectedDataWithoutArrays);
  expect(dataWithoutNumbers).toEqual(expectedDataWithoutNumbers);
  expect(dataWithoutObjects).toEqual(expectedDataWithoutObjects);
});
