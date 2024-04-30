import {Logger} from '../logger/index.js';
import {PartialRecord} from '../types.js';

function generateId() {
  return `${Date.now()}-${Math.random()}`;
}

export class PromiseStore {
  protected promiseRecord: PartialRecord<string, Promise<unknown>> = {};
  protected isClosed = false;

  constructor(protected logger: Logger = console) {}

  /** Add a promise, but handle it's failure if it fails and do nothing. */
  forget(promise: unknown) {
    const id: string = generateId();
    this.replace(promise, id, /** forget */ true);
    return this;
  }

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

  protected assertNotClosed() {
    if (this.isClosed) {
      throw new Error('PromiseStore is closed');
    }
  }

  protected replace(promise: unknown, id: string, forget = false) {
    this.assertNotClosed();

    if (!(promise instanceof Promise)) {
      return;
    }

    if (forget) {
      promise = this.awaitForgetPromise(promise);
    }

    this.promiseRecord[id] = promise as Promise<unknown>;
    (promise as Promise<unknown>).finally(() => {
      delete this.promiseRecord[id];
    });
  }

  protected async awaitForgetPromise(p: Promise<unknown>): Promise<void> {
    try {
      await p;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
