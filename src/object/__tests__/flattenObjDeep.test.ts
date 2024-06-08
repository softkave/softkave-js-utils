import {describe, expect, test} from 'vitest';
import {flattenObjDeep} from '../flattenObjDeep.js';

describe('flattenObjDeep', () => {
  test('single depth obj', () => {
    const obj = {
      str: 'string',
      num: 'number',
      1: 'one',
      0: 'zero',
    };

    const result = flattenObjDeep(obj);

    expect(result).toMatchObject(obj);
  });

  test('multi depth obj', () => {
    const obj = {
      str: 'string',
      num: 'number',
      obj: {
        1: 'one',
        0: 'zero',
        obj: {str: 'string', num: 'number'},
      },
    };

    const result = flattenObjDeep(obj);

    const expectedObj = {
      str: 'string',
      num: 'number',
      'obj.1': 'one',
      'obj.0': 'zero',
      'obj.obj.str': 'string',
      'obj.obj.num': 'number',
    };
    expect(result).toMatchObject(expectedObj);
  });

  test('multi depth obj with array', () => {
    const obj = {
      str: 'string',
      num: 'number',
      obj: {
        1: 'one',
        0: 'zero',
        arr: [1, 2, 3],
        objArr: [{1: 'one'}, {str: 'string'}],
      },
    };

    const result = flattenObjDeep(obj);

    const expectedObj = {
      str: 'string',
      num: 'number',
      'obj.1': 'one',
      'obj.0': 'zero',
      'obj.arr.0': 1,
      'obj.arr.1': 2,
      'obj.arr.2': 3,
      'obj.objArr.0.1': 'one',
      'obj.objArr.1.str': 'string',
    };
    expect(result).toMatchObject(expectedObj);
  });

  test('single depth array', () => {
    const arr = ['string', 'num', 1, 0];

    const result = flattenObjDeep(arr);

    const expectedObj = {
      '0': 'string',
      '1': 'num',
      '2': 1,
      '3': 0,
    };
    expect(result).toMatchObject(expectedObj);
  });

  test('multi depth array', () => {
    const arr = [
      {str: 'string', num: 'number'},
      {1: 'one', 0: 'zero'},
    ];

    const result = flattenObjDeep(arr);

    const expectedObj = {
      '0.str': 'string',
      '0.num': 'number',
      '1.1': 'one',
      '1.0': 'zero',
    };
    expect(result).toMatchObject(expectedObj);
  });
});
