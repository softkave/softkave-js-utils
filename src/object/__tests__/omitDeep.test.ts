import {isArray, isObject, isNumber} from 'lodash';
import {omitDeep} from '../omitDeep';

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
