import {ReadonlyDeep} from 'type-fest';
import {convertToArray} from '../array/convertToArray';
import {PromiseStore} from '../promise/PromiseStore';
import {OrPromise} from '../types';

export interface DisposableResource {
  /** Dispose of resource in /src/endpoints/contexts/globalUtils.ts */
  dispose?: () => OrPromise<void>;
}

/** NOTE: `DisposablesStore` must never be a disposable resource (basically any
 * resource with a `close()` function) because we automatically add all
 * disposable resources registered with our dep injection container into
 * `DisposablesStore`. */
export class DisposablesStore {
  protected disposablesMap = new Map<DisposableResource, DisposableResource>();

  constructor(protected promises: PromiseStore) {}

  add = (disposable: DisposableResource | DisposableResource[]) => {
    convertToArray(disposable).forEach(next =>
      this.disposablesMap.set(next, next)
    );
  };

  getMap = (): ReadonlyDeep<Map<DisposableResource, DisposableResource>> => {
    return this.disposablesMap;
  };

  getList = (): ReadonlyDeep<DisposableResource[]> => {
    return Array.from(this.disposablesMap.values());
  };

  forgetDisposeAll = () => {
    this.disposablesMap.forEach(disposable => {
      if (disposable.dispose) {
        this.promises.forget(disposable.dispose());
      }
    });
  };

  awaitDisposeAll = async () => {
    const promises: Array<unknown> = [];
    this.disposablesMap.forEach(disposable => {
      if (disposable.dispose) {
        promises.push(disposable.dispose());
      }
    });
    await Promise.all(promises);
  };
}
