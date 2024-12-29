import {describe, expectTypeOf, test} from 'vitest';
import {ConvertT1ToT2Deep} from '../types.js';

describe('types', () => {
  test('should convert undefined to null', () => {
    const a: ConvertT1ToT2Deep<{a: undefined}, undefined, null> = {a: null};
    expectTypeOf(a).toEqualTypeOf({a: null});
  });

  test('should convert types nested objects', () => {
    const a: ConvertT1ToT2Deep<{a: {b: undefined}}, undefined, null> = {
      a: {b: null},
    };
    expectTypeOf(a).toEqualTypeOf({a: {b: null}});
  });

  test('should maintain other values', () => {
    const a: ConvertT1ToT2Deep<
      {a: number; stringList: string[]},
      undefined,
      null
    > = {
      a: 1,
      stringList: ['a', 'b'],
    };
    expectTypeOf(a).toEqualTypeOf({a: 1, stringList: ['a', 'b']});
  });

  test('should convert date to string', () => {
    const date = new Date();
    const a: ConvertT1ToT2Deep<{a: Date}, Date, string> = {
      a: date.toISOString(),
    };
    expectTypeOf(a).toEqualTypeOf({a: date.toISOString()});
  });
});
