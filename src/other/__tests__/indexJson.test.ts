import {get, set} from 'lodash-es';
import {describe, expect, test} from 'vitest';
import {indexJson} from '../indexJson.js';

describe('indexJson', () => {
  test('should index a primitive value', () => {
    const json = {
      name: 'John',
      age: 30,
    };
    const indexed = indexJson(json);
    expect(indexed).toEqual({
      name: {
        key: ['name'],
        value: ['John'],
        keyType: ['string'],
        valueType: new Set(['string']),
      },
      age: {
        key: ['age'],
        value: [30],
        keyType: ['string'],
        valueType: new Set(['number']),
      },
    });
  });

  test('should index a nested object', () => {
    const json = {
      person: {
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345',
        },
      },
    };
    const indexed = indexJson(json);
    expect(indexed).toEqual({
      'person.name': {
        key: ['person', 'name'],
        value: ['John'],
        keyType: ['string', 'string'],
        valueType: new Set(['string']),
      },
      'person.age': {
        key: ['person', 'age'],
        value: [30],
        keyType: ['string', 'string'],
        valueType: new Set(['number']),
      },
      'person.address.street': {
        key: ['person', 'address', 'street'],
        value: ['123 Main St'],
        keyType: ['string', 'string', 'string'],
        valueType: new Set(['string']),
      },
      'person.address.city': {
        key: ['person', 'address', 'city'],
        value: ['Anytown'],
        keyType: ['string', 'string', 'string'],
        valueType: new Set(['string']),
      },
      'person.address.state': {
        key: ['person', 'address', 'state'],
        value: ['CA'],
        keyType: ['string', 'string', 'string'],
        valueType: new Set(['string']),
      },
      'person.address.zip': {
        key: ['person', 'address', 'zip'],
        value: ['12345'],
        keyType: ['string', 'string', 'string'],
        valueType: new Set(['string']),
      },
    });
  });

  test('should index an array of primitive values', () => {
    const json = {
      numbers: [1, 2, 3],
    };
    const indexed = indexJson(json);
    expect(indexed).toEqual({
      'numbers.0': {
        key: ['numbers', 0],
        value: [1],
        keyType: ['string', 'number'],
        valueType: new Set(['number']),
      },
      'numbers.1': {
        key: ['numbers', 1],
        value: [2],
        keyType: ['string', 'number'],
        valueType: new Set(['number']),
      },
      'numbers.2': {
        key: ['numbers', 2],
        value: [3],
        keyType: ['string', 'number'],
        valueType: new Set(['number']),
      },
    });
  });

  test('should index an array of objects', () => {
    const json = {
      people: [
        {name: 'John', age: 30},
        {name: 'Jane', age: 25},
      ],
    };
    const indexed = indexJson(json);
    expect(indexed).toEqual({
      'people.0.name': {
        key: ['people', 0, 'name'],
        value: ['John'],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['string']),
      },
      'people.0.age': {
        key: ['people', 0, 'age'],
        value: [30],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'people.1.name': {
        key: ['people', 1, 'name'],
        value: ['Jane'],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['string']),
      },
      'people.1.age': {
        key: ['people', 1, 'age'],
        value: [25],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
    });
  });

  test('should index an array of arrays', () => {
    const json = {
      numbers: [
        [1, 2],
        [3, 4],
        [5, 6],
      ],
    };
    const indexed = indexJson(json);
    expect(get(indexed, 'numbers.0.0')).toEqual({
      key: ['numbers', 0, 0],
      value: [1],
      keyType: ['string', 'number', 'number'],
      valueType: new Set(['number']),
    });
    expect(get(indexed, 'numbers.0.1')).toEqual({
      key: ['numbers', 0, 1],
      value: [2],
      keyType: ['string', 'number', 'number'],
      valueType: new Set(['number']),
    });
    expect(get(indexed, 'numbers.1.0')).toEqual({
      key: ['numbers', 1, 0],
      value: [3],
      keyType: ['string', 'number', 'number'],
      valueType: new Set(['number']),
    });
    expect(get(indexed, 'numbers.2.1')).toEqual({
      key: ['numbers', 2, 1],
      value: [6],
      keyType: ['string', 'number', 'number'],
      valueType: new Set(['number']),
    });
  });

  test('edge case 01', () => {
    const json = {
      numbers: [],
    };
    const indexed = indexJson(json);
    expect(indexed).toEqual({
      numbers: {
        key: ['numbers'],
        value: [],
        keyType: ['string'],
        valueType: new Set([]),
      },
    });
  });

  test('edge case 01.01', () => {
    const json = {
      numbers: [[], [1, []]],
    };
    const indexed = indexJson(json);
    expect(indexed).toEqual({
      'numbers.0': {
        key: ['numbers', 0],
        value: [],
        keyType: ['string', 'number'],
        valueType: new Set([]),
      },
      'numbers.1.0': {
        key: ['numbers', 1, 0],
        value: [1],
        keyType: ['string', 'number', 'number'],
        valueType: new Set(['number']),
      },
      'numbers.1.1': {
        key: ['numbers', 1, 1],
        value: [],
        keyType: ['string', 'number', 'number'],
        valueType: new Set([]),
      },
    });
  });

  test('edge case 01.02', () => {
    const json = {};
    const indexed = indexJson(json);
    expect(indexed).toEqual({});
  });

  test('edge case 01.03', () => {
    const json = {a: {}};
    const indexed = indexJson(json);
    expect(indexed).toEqual({
      a: {
        key: ['a'],
        value: [],
        keyType: ['string'],
        valueType: new Set([]),
      },
    });
  });

  test('edge case 02', () => {
    const json = {
      numbers: [
        [[1, [2, 3]], 4],
        [5, 6],
      ],
    };
    const indexed = indexJson(json);
    expect(get(indexed, 'numbers.0.1')).toEqual({
      key: ['numbers', 0, 1],
      value: [4],
      keyType: ['string', 'number', 'number'],
      valueType: new Set(['number']),
    });
    expect(get(indexed, 'numbers.1.0')).toEqual({
      key: ['numbers', 1, 0],
      value: [5],
      keyType: ['string', 'number', 'number'],
      valueType: new Set(['number']),
    });
    expect(get(indexed, 'numbers.1.1')).toEqual({
      key: ['numbers', 1, 1],
      value: [6],
      keyType: ['string', 'number', 'number'],
      valueType: new Set(['number']),
    });
    expect(get(indexed, 'numbers.0.0.0')).toEqual({
      key: ['numbers', 0, 0, 0],
      value: [1],
      keyType: ['string', 'number', 'number', 'number'],
      valueType: new Set(['number']),
    });
    expect(get(indexed, 'numbers.0.0.1.0')).toEqual({
      key: ['numbers', 0, 0, 1, 0],
      value: [2],
      keyType: ['string', 'number', 'number', 'number', 'number'],
      valueType: new Set(['number']),
    });
    expect(get(indexed, 'numbers.0.0.1.1')).toEqual({
      key: ['numbers', 0, 0, 1, 1],
      value: [3],
      keyType: ['string', 'number', 'number', 'number', 'number'],
      valueType: new Set(['number']),
    });
  });

  test('edge case 03', () => {
    const json = {b: undefined, c: null};
    set(json, 'a.3', 1);
    set(json, 'a.4', 2);
    set(json, 'a.5', 3);
    const indexed = indexJson(json);
    expect(indexed).toEqual({
      'a.3': {
        key: ['a', 3],
        value: [1],
        keyType: ['string', 'number'],
        valueType: new Set(['number']),
      },
      'a.4': {
        key: ['a', 4],
        value: [2],
        keyType: ['string', 'number'],
        valueType: new Set(['number']),
      },
      'a.5': {
        key: ['a', 5],
        value: [3],
        keyType: ['string', 'number'],
        valueType: new Set(['number']),
      },
      b: {
        key: ['b'],
        value: [undefined],
        keyType: ['string'],
        valueType: new Set(['undefined']),
      },
      c: {
        key: ['c'],
        value: [null],
        keyType: ['string'],
        valueType: new Set(['null']),
      },
    });
  });

  test('should handle flattenNumericKeys option - true', () => {
    const json = {
      a: [
        {
          b: 1,
        },
        {
          b: 2,
        },
      ],
    };
    const indexed = indexJson(json, {flattenNumericKeys: true});
    expect(indexed).toEqual({
      'a.0.b': {
        key: ['a', 0, 'b'],
        value: [1],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.1.b': {
        key: ['a', 1, 'b'],
        value: [2],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.b': {
        key: ['a', 'b'],
        value: [1, 2],
        keyType: ['string', 'string'],
        valueType: new Set(['number']),
      },
    });
  });

  test('should handle flattenNumericKeys option - false', () => {
    const json = {
      a: [
        {
          b: 1,
        },
        {
          b: 2,
        },
      ],
    };
    const indexed = indexJson(json, {flattenNumericKeys: false});
    expect(indexed).toEqual({
      'a.0.b': {
        key: ['a', 0, 'b'],
        value: [1],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.1.b': {
        key: ['a', 1, 'b'],
        value: [2],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
    });
  });

  test('should handle flattenNumericKeys with nested arrays', () => {
    const json = {
      a: [
        [{b: 1}, {b: 2}],
        [{b: 3}, {b: 4}],
      ],
    };
    const indexed = indexJson(json, {flattenNumericKeys: true});
    expect(indexed).toEqual({
      'a.0.0.b': {
        key: ['a', 0, 0, 'b'],
        value: [1],
        keyType: ['string', 'number', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.0.1.b': {
        key: ['a', 0, 1, 'b'],
        value: [2],
        keyType: ['string', 'number', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.1.0.b': {
        key: ['a', 1, 0, 'b'],
        value: [3],
        keyType: ['string', 'number', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.1.1.b': {
        key: ['a', 1, 1, 'b'],
        value: [4],
        keyType: ['string', 'number', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.0.b': {
        key: ['a', 0, 'b'],
        value: [1, 2],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.1.b': {
        key: ['a', 1, 'b'],
        value: [3, 4],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.b': {
        key: ['a', 'b'],
        value: [1, 2, 3, 4],
        keyType: ['string', 'string'],
        valueType: new Set(['number']),
      },
    });
  });

  test('should handle flattenNumericKeys with mixed types', () => {
    const json = {
      a: [
        {b: 1, c: 'x'},
        {b: 2, c: 'y'},
      ],
    };
    const indexed = indexJson(json, {flattenNumericKeys: true});
    expect(indexed).toEqual({
      'a.0.b': {
        key: ['a', 0, 'b'],
        value: [1],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.0.c': {
        key: ['a', 0, 'c'],
        value: ['x'],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['string']),
      },
      'a.1.b': {
        key: ['a', 1, 'b'],
        value: [2],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['number']),
      },
      'a.1.c': {
        key: ['a', 1, 'c'],
        value: ['y'],
        keyType: ['string', 'number', 'string'],
        valueType: new Set(['string']),
      },
      'a.b': {
        key: ['a', 'b'],
        value: [1, 2],
        keyType: ['string', 'string'],
        valueType: new Set(['number']),
      },
      'a.c': {
        key: ['a', 'c'],
        value: ['x', 'y'],
        keyType: ['string', 'string'],
        valueType: new Set(['string']),
      },
    });
  });
});
