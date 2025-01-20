import {first, noop} from 'lodash-es';
import {ValueOf} from 'type-fest';
import {getNewId} from '../id/index.js';
import {getDeferredPromise} from '../promise/getDeferredPromise.js';
import {AnyFn, OrPromise, PartialRecord} from '../types.js';
import {ListenableResource} from './ListenableResource.js';

const kLockQueueItemState = {
  waiting: 'w',
  waitingOnResolve: 'wr',
} as const;

type LockQueueItemState = ValueOf<typeof kLockQueueItemState>;

interface LockQueueItem {
  state: LockQueueItemState;
  resolveFn: AnyFn;
}

export class LockStore {
  protected locks: PartialRecord<string, ListenableResource<LockQueueItem>[]> =
    {};
  protected waiters: Array<{remaining: number; resolveFn: AnyFn}> = [];

  async run<TFn extends AnyFn>(
    name: string,
    fn: TFn
  ): Promise<Awaited<ReturnType<TFn>>> {
    await this.acquire(name);

    try {
      console.log('run', name);
      return await fn();
    } finally {
      console.log('release', name);
      this.release(name);
    }
  }

  has(name: string) {
    return !!this.getLockQueue(name, false)?.length;
  }

  wait(name: string, remaining?: number) {
    const queueLength = this.getLockQueue(name, false)?.length ?? 0;
    remaining = remaining ?? queueLength;

    if (queueLength === 0 || remaining <= 0) {
      console.log('resolve', {name, remaining, queueLength});
      return Promise.resolve();
    }

    const p = getDeferredPromise();
    const waiter = {remaining, resolveFn: p.resolve};
    this.waiters.push(waiter);
    return p.promise;
  }

  protected acquire(name: string) {
    const queue = this.getLockQueue(name, true);
    const item = new ListenableResource<LockQueueItem>({
      state: kLockQueueItemState.waitingOnResolve,
      resolveFn: noop,
    });

    queue.push(item);
    const p = new Promise<void>(resolve => {
      item.set({
        state: kLockQueueItemState.waiting,
        resolveFn: resolve,
      });
    });

    setTimeout(() => this.execNext(name), 0);
    return p;
  }

  protected release(name: string) {
    const queue = this.getLockQueue(name, true);
    queue.shift();
    this.waiters = this.waiters.filter(w => {
      w.remaining--;
      const isWaitDone = w.remaining <= 0;

      if (isWaitDone) {
        console.log('resolve', name);
        w.resolveFn();
      }

      return !isWaitDone;
    });

    this.execNext(name);
  }

  protected execNext = (name: string) => {
    const queue = this.getLockQueue(name, true);
    const next = first(queue);
    const item = next?.get();

    if (!next || !item) {
      return;
    }

    if (item.state === kLockQueueItemState.waitingOnResolve) {
      next.listen(this.execLockItem);
    }

    this.execLockItem(item);
  };

  protected execLockItem = (item?: LockQueueItem) => {
    if (item?.state === kLockQueueItemState.waiting) {
      item.resolveFn();
      return true;
    }

    return false;
  };

  protected getLockQueue<
    TInitQueue extends boolean = true,
    TResult = TInitQueue extends true
      ? ListenableResource<LockQueueItem>[]
      : ListenableResource<LockQueueItem>[] | undefined,
  >(name: string, init: TInitQueue): TResult {
    let queue = this.locks[name];

    if (!queue && init) {
      queue = this.locks[name] = [];
    }

    return queue as TResult;
  }
}

export class LockableResource<T> {
  protected resource: T;
  protected name: string;

  constructor(
    protected locks: LockStore,
    resource: T,
    name = getNewId()
  ) {
    this.resource = resource;
    this.name = name;
  }

  async run(fn: AnyFn<[T], OrPromise<T | void>>) {
    await this.locks.run(this.name, async () => {
      const newData = await fn(this.resource);

      if (newData) {
        this.resource = newData;
      }
    });
  }
}

interface ISingleInstanceRunnerMakeOptions<TFn extends AnyFn> {
  instanceSpecifier: (...args: Parameters<TFn>) => string;
  fn: TFn;
}

export class SingleInstanceRunner {
  static make<TFn extends AnyFn>(
    locks: LockStore,
    opts: ISingleInstanceRunnerMakeOptions<TFn>
  ) {
    return async (
      ...args: Parameters<TFn>
    ): Promise<Awaited<ReturnType<TFn>>> => {
      const id = opts.instanceSpecifier(...args);
      return await locks.run(id, () => opts.fn(...args));
    };
  }
}
