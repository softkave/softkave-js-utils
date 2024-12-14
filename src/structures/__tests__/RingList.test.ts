import {describe, expect, test} from 'vitest';
import {RingList} from '../RingList.js';

describe('RingList', () => {
  test('should add and remove items', () => {
    const ringList = new RingList(3);
    expect(ringList.add(1)).toBe(true);
    expect(ringList.remaining()).toBe(2);
    expect(ringList.values()).toEqual([1]);
    expect(ringList.add(2)).toBe(true);
    expect(ringList.remaining()).toBe(1);
    expect(ringList.values()).toEqual([1, 2]);
    expect(ringList.add(3)).toBe(true);
    expect(ringList.remaining()).toBe(0);
    expect(ringList.values()).toEqual([1, 2, 3]);
    expect(ringList.add(4)).toBe(false);
    expect(ringList.remaining()).toBe(0);
    expect(ringList.values()).toEqual([1, 2, 3]);
    expect(ringList.removeNext()).toBe(1);
    expect(ringList.remaining()).toBe(1);
    expect(ringList.values()).toEqual([2, 3]);
    expect(ringList.removeNext()).toBe(2);
    expect(ringList.remaining()).toBe(2);
    expect(ringList.values()).toEqual([3]);
    expect(ringList.removeNext()).toBe(3);
    expect(ringList.remaining()).toBe(3);
    expect(ringList.values()).toEqual([]);
    expect(ringList.removeNext()).toBe(undefined);
    expect(ringList.remaining()).toBe(3);

    expect(ringList.add(5)).toBe(true);
    expect(ringList.remaining()).toBe(2);
    expect(ringList.values()).toEqual([5]);
    expect(ringList.add(6)).toBe(true);
    expect(ringList.remaining()).toBe(1);
    expect(ringList.values()).toEqual([5, 6]);
    expect(ringList.removeNext()).toBe(5);
    expect(ringList.remaining()).toBe(2);
    expect(ringList.values()).toEqual([6]);
    expect(ringList.removeNext()).toBe(6);
    expect(ringList.remaining()).toBe(3);
    expect(ringList.values()).toEqual([]);
    expect(ringList.removeNext()).toBe(undefined);
    expect(ringList.remaining()).toBe(3);
  });
});
