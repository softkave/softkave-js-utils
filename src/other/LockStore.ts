import {first, noop} from 'lodash';
import {ValueOf} from 'type-fest';
import {getNewId} from '../id/getNewId';
import {AnyFn, OrPromise, PartialRecord} from '../types';
import {ListenableResource} from './ListenableResource';

const kLockQueueItemState = {
  waiting: 'waiting',
  waitingOnResolve: 'waitingOnResolve',
} as const;

type LockQueueItemState = ValueOf<typeof kLockQueueItemState>;

interface LockQueueItem {
  state: LockQueueItemState;
  resolveFn: AnyFn;
}

export class LockStore {
  protected locks: PartialRecord<string, ListenableResource<LockQueueItem>[]> =
    {};

  async run(name: string, fn: AnyFn) {
    await this.acquire(name);

    try {
      await fn();
    } finally {
      this.release(name);
    }
  }

  protected acquire(name: string) {
    const queue = this.getLockQueue(name);
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
    const queue = this.getLockQueue(name);
    queue.shift();
    this.execNext(name);
  }

  protected execNext = (name: string) => {
    const queue = this.getLockQueue(name);
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

  protected getLockQueue(name: string) {
    let queue = this.locks[name];

    if (!queue) {
      queue = this.locks[name] = [];
    }

    return queue;
  }
}

export class LockableResource<T> {
  constructor(
    protected store: LockStore,
    protected resource: T,
    protected name = getNewId()
  ) {}

  async run(fn: AnyFn<[T], OrPromise<T | void>>) {
    await this.store.run(this.name, async () => {
      const newData = await fn(this.resource);

      if (newData) {
        this.resource = newData;
      }
    });
  }
}
