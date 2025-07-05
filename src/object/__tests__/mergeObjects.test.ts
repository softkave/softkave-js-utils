import {describe, expect, test} from 'vitest';
import {mergeObjects} from '../mergeObjects.js';

describe('mergeObjects', () => {
  describe('basic object merging', () => {
    test('should merge simple objects', () => {
      const dest = {a: 1, b: 2};
      const source = {b: 3, c: 4};
      const result = mergeObjects(dest, source);

      expect(result).toEqual({a: 1, b: 3, c: 4});
    });

    test('should merge nested objects', () => {
      const dest = {a: {x: 1, y: 2}, b: 3};
      const source = {a: {y: 4, z: 5}, c: 6};
      const result = mergeObjects(dest, source);

      expect(result).toEqual({a: {x: 1, y: 4, z: 5}, b: 3, c: 6});
    });

    test('should handle null and undefined values', () => {
      const dest = {a: 1, b: null, c: undefined};
      const source = {a: null, b: 2, d: undefined};
      const result = mergeObjects(dest, source);

      expect(result).toEqual({a: null, b: 2, c: undefined, d: undefined});
    });
  });

  describe('array update strategies', () => {
    describe('replace strategy (default)', () => {
      test('should replace arrays by default', () => {
        const dest = {items: [1, 2, 3], other: 'keep'};
        const source = {items: [4, 5], newProp: 'add'};
        const result = mergeObjects(dest, source);

        expect(result).toEqual({items: [4, 5], other: 'keep', newProp: 'add'});
      });

      test('should replace nested arrays', () => {
        const dest = {nested: {items: [1, 2, 3]}};
        const source = {nested: {items: [4, 5]}};
        const result = mergeObjects(dest, source);

        expect(result).toEqual({nested: {items: [4, 5]}});
      });

      test('should handle when source is null', () => {
        const dest = {items: [1, 2, 3]};
        const source = {items: null};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'replace',
        });

        expect(result).toEqual({items: null});
      });
    });

    describe('concat strategy', () => {
      test('should concatenate arrays', () => {
        const dest = {items: [1, 2, 3], other: 'keep'};
        const source = {items: [4, 5], newProp: 'add'};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'concat',
        });

        expect(result).toEqual({
          items: [1, 2, 3, 4, 5],
          other: 'keep',
          newProp: 'add',
        });
      });

      test('should concatenate nested arrays', () => {
        const dest = {nested: {items: [1, 2, 3]}};
        const source = {nested: {items: [4, 5]}};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'concat',
        });

        expect(result).toEqual({nested: {items: [1, 2, 3, 4, 5]}});
      });

      test('should handle when source array is empty', () => {
        const dest = {items: [1, 2, 3]};
        const source = {items: []};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'concat',
        });

        expect(result).toEqual({items: [1, 2, 3]});
      });

      test('should handle when dest array is empty', () => {
        const dest = {items: []};
        const source = {items: [1, 2, 3]};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'concat',
        });

        expect(result).toEqual({items: [1, 2, 3]});
      });

      test('should handle when source is null', () => {
        const dest = {items: [1, 2, 3]};
        const source = {items: null};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'concat',
        });

        expect(result).toEqual({items: [1, 2, 3, null]});
      });

      test('should handle when dest is null', () => {
        const dest = {items: null};
        const source = {items: [1, 2, 3]};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'concat',
        });

        expect(result).toEqual({items: [1, 2, 3]});
      });
    });

    describe('retain strategy', () => {
      test('should retain original arrays', () => {
        const dest = {items: [1, 2, 3], other: 'keep'};
        const source = {items: [4, 5], newProp: 'add'};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'retain',
        });

        expect(result).toEqual({
          items: [1, 2, 3],
          other: 'keep',
          newProp: 'add',
        });
      });

      test('should retain nested arrays', () => {
        const dest = {nested: {items: [1, 2, 3]}};
        const source = {nested: {items: [4, 5]}};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'retain',
        });

        expect(result).toEqual({nested: {items: [1, 2, 3]}});
      });

      test('should handle when dest array is empty', () => {
        const dest = {items: []};
        const source = {items: [1, 2, 3]};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'retain',
        });

        expect(result).toEqual({items: []});
      });
    });

    describe('merge strategy', () => {
      test('should use lodash default merge behavior', () => {
        const dest = {items: [1, 2, 3], other: 'keep'};
        const source = {items: [4, 5], newProp: 'add'};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'merge',
        });

        // lodash merge behavior: when both are arrays, it merges them
        expect(result).toEqual({
          items: [4, 5, 3],
          other: 'keep',
          newProp: 'add',
        });
      });

      test('should merge nested arrays', () => {
        const dest = {nested: {items: [1, 2, 3]}};
        const source = {nested: {items: [4, 5]}};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'merge',
        });

        expect(result).toEqual({nested: {items: [4, 5, 3]}});
      });

      test('should handle when dest is null', () => {
        const dest = {items: null};
        const source = {items: [1, 2, 3]};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'merge',
        });

        expect(result).toEqual({items: [1, 2, 3]});
      });

      test('should handle when source is null', () => {
        const dest = {items: [1, 2, 3]};
        const source = {items: null};
        const result = mergeObjects(dest, source, {
          arrayUpdateStrategy: 'merge',
        });

        expect(result).toEqual({items: null});
      });
    });
  });

  describe('edge cases', () => {
    test('should handle empty objects', () => {
      const dest = {};
      const source = {};
      const result = mergeObjects(dest, source);

      expect(result).toEqual({});
    });

    test('should handle when source is empty', () => {
      const dest = {a: 1, b: 2};
      const source = {};
      const result = mergeObjects(dest, source);

      expect(result).toEqual({a: 1, b: 2});
    });

    test('should handle when dest is empty', () => {
      const dest = {};
      const source = {a: 1, b: 2};
      const result = mergeObjects(dest, source);

      expect(result).toEqual({a: 1, b: 2});
    });

    test('should handle non-array values with array strategies', () => {
      const dest = {value: 'string'};
      const source = {value: 123};
      const result = mergeObjects(dest, source, {
        arrayUpdateStrategy: 'concat',
      });

      expect(result).toEqual({value: 123});
    });

    test('should handle when only source has array', () => {
      const dest = {items: 'not-an-array'};
      const source = {items: [1, 2, 3]};
      const result = mergeObjects(dest, source, {
        arrayUpdateStrategy: 'concat',
      });

      expect(result).toEqual({items: [1, 2, 3]});
    });

    test('should handle when only dest has array', () => {
      const dest = {items: [1, 2, 3]};
      const source = {items: 'not-an-array'};
      const result = mergeObjects(dest, source, {
        arrayUpdateStrategy: 'concat',
      });

      // When only dest is an array, lodash merge behavior takes over
      // and concatenates the non-array value to the array
      expect(result).toEqual({items: [1, 2, 3, 'not-an-array']});
    });

    test('should handle complex nested structures', () => {
      const dest = {
        user: {
          name: 'John',
          preferences: {
            colors: ['red', 'blue'],
            settings: {theme: 'dark'},
          },
          tags: ['admin'],
        },
      };
      const source = {
        user: {
          age: 30,
          preferences: {
            colors: ['green'],
            settings: {fontSize: 'large'},
          },
          tags: ['user'],
        },
      };
      const result = mergeObjects(dest, source, {
        arrayUpdateStrategy: 'concat',
      });

      expect(result).toEqual({
        user: {
          name: 'John',
          age: 30,
          preferences: {
            colors: ['red', 'blue', 'green'],
            settings: {theme: 'dark', fontSize: 'large'},
          },
          tags: ['admin', 'user'],
        },
      });
    });

    test('should mutate original dest object', () => {
      const dest = {a: 1, items: [1, 2, 3]};
      const source = {b: 2, items: [4, 5]};
      const destCopy = JSON.parse(JSON.stringify(dest));
      const sourceCopy = JSON.parse(JSON.stringify(source));

      const result = mergeObjects(dest, source, {
        arrayUpdateStrategy: 'concat',
      });

      // lodash mergeWith mutates the dest object
      expect(dest).not.toEqual(destCopy);
      expect(dest).toEqual(result);
      expect(source).toEqual(sourceCopy);
    });
  });
});
