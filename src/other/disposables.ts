import {ReadonlyDeep} from 'type-fest';
import {convertToArray} from '../array/convertToArray.js';
import {PromiseStore} from '../promise/PromiseStore.js';
import {OrPromise} from '../types.js';

export interface DisposableResource {
  dispose?: () => OrPromise<void>;
}

export class DisposablesStore {
  protected disposablesMap = new Map<unknown, DisposableResource>();

  constructor(protected promises: PromiseStore) {
    this.add = this.add.bind(this);
  }

  add(disposable: DisposableResource | DisposableResource[]): void;
  add(key: unknown, disposable: DisposableResource): void;
  add(...args: unknown[]) {
    if (args.length === 1) {
      convertToArray(
        args[0] as DisposableResource | DisposableResource[]
      ).forEach(next => this.disposablesMap.set(next, next));
    } else {
      this.disposablesMap.set(args[0], args[1] as DisposableResource);
    }
  }

  get = (key: unknown): DisposableResource | undefined => {
    return this.disposablesMap.get(key);
  };

  has = (key: unknown): boolean => {
    return this.disposablesMap.has(key);
  };

  getMap = (): ReadonlyDeep<Map<unknown, DisposableResource>> => {
    return this.disposablesMap;
  };

  getList = (): ReadonlyDeep<DisposableResource[]> => {
    return Array.from(this.disposablesMap.values());
  };

  forgetDisposeAll = () => {
    this.disposablesMap.forEach(disposable => {
      if (disposable.dispose) {
        this.promises.callAndForget(disposable.dispose.bind(disposable));
      }
    });

    this.disposablesMap.clear();
  };

  awaitDisposeAll = async () => {
    const promises: Array<unknown> = [];
    this.disposablesMap.forEach(disposable => {
      if (disposable.dispose) {
        promises.push(disposable.dispose());
      }
    });

    await Promise.all(promises);
    this.disposablesMap.clear();
  };

  /**
   * if an individual key is an array, i.e. you called `add` with an array as
   * the key, e.g. `add([1, 2, 3], disposable)`, then use `removeOne` instead of
   * `remove`
   */
  remove = (key: unknown | unknown[]) => {
    convertToArray(key).forEach(next => this.disposablesMap.delete(next));
  };

  removeOne = (key: unknown) => {
    this.disposablesMap.delete(key);
  };

  awaitDisposeOne = async (key: unknown) => {
    const disposable = this.disposablesMap.get(key);

    if (disposable && disposable.dispose) {
      await disposable.dispose();
      this.disposablesMap.delete(key);
    }
  };

  forgetDisposeOne = (key: unknown) => {
    const disposable = this.disposablesMap.get(key);

    if (disposable && disposable.dispose) {
      this.promises.callAndForget(disposable.dispose.bind(disposable));
      this.disposablesMap.delete(key);
    }
  };

  awaitDisposeMany = async (keys: unknown[]) => {
    const promises: Array<unknown> = [];
    keys.forEach(key => {
      const disposable = this.disposablesMap.get(key);

      if (disposable && disposable.dispose) {
        promises.push(disposable.dispose());
        this.disposablesMap.delete(key);
      }
    });

    await Promise.all(promises);
  };

  forgetDisposeMany = (keys: unknown[]) => {
    keys.forEach(key => {
      const disposable = this.disposablesMap.get(key);

      if (disposable && disposable.dispose) {
        this.promises.callAndForget(disposable.dispose.bind(disposable));
        this.disposablesMap.delete(key);
      }
    });
  };
}
