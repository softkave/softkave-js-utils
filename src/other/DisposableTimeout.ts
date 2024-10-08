import {AnyFn} from '../types.js';
import {DisposableResource} from './disposables.js';

export class DisposableTimeout implements DisposableResource {
  protected timeoutId: NodeJS.Timeout | undefined;

  constructor(
    protected ms: number,
    protected fn: AnyFn,
    protected onDispose?: AnyFn
  ) {
    this.timeoutId = setTimeout(() => {
      this.timeoutId = undefined;
      fn();
      onDispose?.();
    }, ms);
  }

  extend(ms: number) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.timeoutId = undefined;
        this.fn();
        this.onDispose?.();
      }, ms);
    }
  }

  dispose() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
      this.onDispose?.();
    }
  }
}
