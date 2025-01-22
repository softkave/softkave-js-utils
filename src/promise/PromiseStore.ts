import {Logger} from '../logger/index.js';
import {PartialRecord} from '../types.js';
import {isPromise} from './isPromiseLike.js';

function generateId() {
  return `${Date.now()}-${Math.random()}`;
}

export class PromiseStore {
  protected promiseRecord: PartialRecord<string, Promise<unknown>> = {};
  protected isClosed = false;

  constructor(protected logger: Logger = console) {}

  /** Returns a promise resolved when all the promises at the time of calling
   * are resolved. This does not include promises stored after this call. */
  async flush() {
    await Promise.allSettled(Object.values(this.promiseRecord));
  }

  /** Prevents addition of new promises. */
  close() {
    this.isClosed = true;
    return this;
  }

  isStoreClosed() {
    return this.isClosed;
  }

  callAndForget(fn: () => unknown | Promise<unknown>) {
    this.assertNotClosed();
    const id: string = generateId();

    try {
      const p = fn();

      if (isPromise(p)) {
        this.promiseRecord[id] = p as Promise<unknown>;
        p.catch(error => {
          this.logger.error(error);
        }).finally(() => {
          delete this.promiseRecord[id];
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  protected assertNotClosed() {
    if (this.isClosed) {
      throw new Error('PromiseStore is closed');
    }
  }
}
