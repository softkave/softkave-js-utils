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

  test('using predefined type', () => {
    type A1 = {a: string};
    type B1 = ConvertT1ToT2Deep<A1, string, number>;
    const b1: B1 = {a: 1};
    expectTypeOf(b1).toEqualTypeOf({a: 1});

    type A2 = {a: {b: string[]}};
    type B2 = ConvertT1ToT2Deep<A2, string, number>;
    const b2: B2 = {a: {b: [1, 2, 3]}};
    expectTypeOf(b2).toEqualTypeOf({a: {b: [1, 2, 3]}});

    type A3 = {a?: string};
    type B3 = ConvertT1ToT2Deep<A3, string, number>;
    const b3: B3 = {a: 1};
    expectTypeOf(b3).toEqualTypeOf(b3);

    type A4 = {a: string | number};
    type B4 = ConvertT1ToT2Deep<A4, string, boolean>;
    const b4: B4 = {a: true};
    expectTypeOf(b4).toEqualTypeOf(b4);

    type A5 = {a: string | number};
    type B5 = ConvertT1ToT2Deep<A5, string | number, boolean>;
    const b5: B5 = {a: 1};
    expectTypeOf(b5).toEqualTypeOf(b5);

    type A6 = {a: string[] | number};
    type B6 = ConvertT1ToT2Deep<A6, string, boolean>;
    const b6: B6 = {a: [true, true, true]};
    expectTypeOf(b6).toEqualTypeOf(b6);

    type A7 = {a: {b?: string | number}};
    type B7 = ConvertT1ToT2Deep<A7, string, boolean>;
    const b7: B7 = {a: {b: true}};
    expectTypeOf(b7).toEqualTypeOf(b7);

    type A8 = {a: {b?: string[]}};
    type B8 = ConvertT1ToT2Deep<A8, string, boolean>;
    const b8: B8 = {a: {b: [true, true, true]}};
    expectTypeOf(b8).toEqualTypeOf(b8);

    type A9 = {a: {b?: Record<string, any>}};
    type B9 = ConvertT1ToT2Deep<A9, undefined, null>;
    // TODO: this is not working as expected, should not accept undefined
    const b9: B9 = {a: {b: undefined}};
    expectTypeOf(b9).toEqualTypeOf(b9);

    type A10 = {a?: Record<string, any>};
    type B10 = ConvertT1ToT2Deep<A10, undefined, null>;
    // TODO: this is not working as expected, should not accept undefined
    const b10: B10 = {a: undefined};
    expectTypeOf(b10).toEqualTypeOf(b10);
  });
});
