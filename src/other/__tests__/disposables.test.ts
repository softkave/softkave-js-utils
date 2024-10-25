import {describe, expect, test, vi} from 'vitest';
import {PromiseStore} from '../../promise/PromiseStore.js';
import {DisposableResource, DisposablesStore} from '../disposables.js';

describe('DisposablesStore', () => {
  test('add, single disposable', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    store.add(disposable);

    expect(store.get(disposable)).toBe(disposable);
  });

  test('add, multiple disposables', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    const disposable2: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    store.add([disposable1, disposable2]);

    expect(store.get(disposable1)).toBe(disposable1);
    expect(store.get(disposable2)).toBe(disposable2);
  });

  test('add, key-value disposable', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    store.add('key', disposable);

    expect(store.get('key')).toBe(disposable);
  });

  test('get', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    store.add(disposable);

    expect(store.get(disposable)).toBe(disposable);
  });

  test('has', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    store.add(disposable);

    expect(store.has(disposable)).toBe(true);
    expect(store.has({})).toBe(false);
  });

  test('getMap', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    const disposable2: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    store.add([disposable1, disposable2]);

    expect(store.getMap().size).toBe(2);
  });

  test('getList', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    const disposable2: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    store.add([disposable1, disposable2]);

    expect(store.getList().length).toBe(2);
  });

  test('forgetDisposeAll', async () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: vi.fn(),
    };
    const disposable2: DisposableResource = {
      dispose: vi.fn(),
    };
    store.add([disposable1, disposable2]);

    store.forgetDisposeAll();
    await promises.flush();

    expect(disposable1.dispose).toHaveBeenCalledTimes(1);
    expect(disposable2.dispose).toHaveBeenCalledTimes(1);
    expect(store.getList().length).toBe(0);
  });

  test('awaitDisposeAll', async () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    const disposable2: DisposableResource = {
      dispose: () => Promise.resolve(),
    };
    store.add([disposable1, disposable2]);

    await store.awaitDisposeAll();

    expect(store.getList().length).toBe(0);
  });

  test('remove, single disposable', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: vi.fn(),
    };
    const disposable2: DisposableResource = {
      dispose: vi.fn(),
    };
    store.add([disposable1, disposable2]);

    store.remove(disposable1);
    expect(store.getList()).toEqual([disposable2]);
  });

  test('remove, multiple disposables', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: vi.fn(),
    };
    const disposable2: DisposableResource = {
      dispose: vi.fn(),
    };
    const disposable3: DisposableResource = {
      dispose: vi.fn(),
    };
    store.add([disposable1, disposable2, disposable3]);

    store.remove([disposable1, disposable2]);
    expect(store.getList()).toEqual([disposable3]);
  });

  test('remove, key-value disposable', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: vi.fn(),
    };
    const disposable2: DisposableResource = {
      dispose: vi.fn(),
    };
    store.add('key1', disposable1);
    store.add('key2', disposable2);

    store.remove('key1');
    expect(store.getList()).toEqual([disposable2]);
  });

  test('remove, unknown key', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: vi.fn(),
    };
    const disposable2: DisposableResource = {
      dispose: vi.fn(),
    };
    store.add([disposable1, disposable2]);

    store.remove({});
    expect(store.getList()).toEqual([disposable1, disposable2]);
  });

  test('removeOne', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: vi.fn(),
    };
    const disposable2: DisposableResource = {
      dispose: vi.fn(),
    };
    store.add([disposable1, disposable2]);

    store.removeOne(disposable1);
    expect(store.getList()).toEqual([disposable2]);
  });

  test('removeOne, using array as key', () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: vi.fn(),
    };
    const key = [1, 2];
    store.add(key, disposable1);

    store.removeOne(key);
    expect(store.getList()).toEqual([]);
  });

  test('awaitDisposeOne', async () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable: DisposableResource = {
      dispose: vi.fn(),
    };
    store.add(disposable);

    await store.awaitDisposeOne(disposable);

    expect(store.getList()).toEqual([]);
    expect(disposable.dispose).toHaveBeenCalledTimes(1);
  });

  test('forgetDisposeOne', async () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable: DisposableResource = {
      dispose: vi.fn().mockResolvedValue(Promise.resolve()),
    };
    store.add(disposable);

    store.forgetDisposeOne(disposable);
    await promises.flush();

    expect(store.getList()).toEqual([]);
    expect(disposable.dispose).toHaveBeenCalledTimes(1);
  });

  test('awaitDisposeMany', async () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: vi.fn(),
    };
    const disposable2: DisposableResource = {
      dispose: vi.fn(),
    };
    store.add([disposable1, disposable2]);

    await store.awaitDisposeMany([disposable1, disposable2]);

    expect(store.getList()).toEqual([]);
    expect(disposable1.dispose).toHaveBeenCalledTimes(1);
    expect(disposable2.dispose).toHaveBeenCalledTimes(1);
  });

  test('forgetDisposeMany', async () => {
    const promises = new PromiseStore();
    const store = new DisposablesStore(promises);

    const disposable1: DisposableResource = {
      dispose: vi.fn().mockResolvedValue(Promise.resolve()),
    };
    const disposable2: DisposableResource = {
      dispose: vi.fn().mockResolvedValue(Promise.resolve()),
    };
    store.add([disposable1, disposable2]);

    store.forgetDisposeMany([disposable1, disposable2]);
    await promises.flush();

    expect(store.getList()).toEqual([]);
    expect(disposable1.dispose).toHaveBeenCalledTimes(1);
    expect(disposable2.dispose).toHaveBeenCalledTimes(1);
  });
});
