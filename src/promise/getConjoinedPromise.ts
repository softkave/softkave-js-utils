import {ValueOf} from 'type-fest';
import {isObjectEmpty} from '../object/isObjectEmpty.js';
import {DeferredPromise, getDeferredPromise} from './getDeferredPromise.js';

export interface ConjoinedPromise {
  deferredPromise: DeferredPromise;
  add: (p: Promise<unknown>) => Promise<unknown>;
  newDeferred: () => DeferredPromise;
  start: () => void;
}

export const kConjoinedPromiseSettlementType = {
  /** Resolves when all the promises added to it are resolved, and rejects when
   * one of them is rejected. */
  all: 'a',
  /** Resolves when all the promises added to it are resolved. */
  allSettled: 's',
} as const;

export type ConjoinedPromiseSettlementType = ValueOf<
  typeof kConjoinedPromiseSettlementType
>;

/** Returns a promise that resolves when all the promises added to it are
 * resolved. */
export function getConjoinedPromise(params: {
  settlementType: ConjoinedPromiseSettlementType;
}): ConjoinedPromise {
  const p = getDeferredPromise();
  const pMap: Record<string, Promise<unknown>> = {};
  let iteration = 0;
  let isStarted = false;

  const onSettled = (id: string | number) => {
    delete pMap[id];
    if (isObjectEmpty(pMap) && isStarted) {
      p.resolve();
    }
  };

  const onRejected = (id: string | number, error: unknown) => {
    delete pMap[id];
    if (isStarted) {
      p.reject(error);
    }
  };

  const add = (p: Promise<unknown>) => {
    const id = iteration++;
    pMap[id] = p;

    if (params.settlementType === kConjoinedPromiseSettlementType.all) {
      p.then(() => onSettled(id)).catch(error => onRejected(id, error));
    } else {
      p.finally(() => onSettled(id));
    }

    return p;
  };

  const newDeferred = () => {
    const p = getDeferredPromise();
    add(p.promise);
    return p;
  };

  const start = () => {
    isStarted = true;
  };

  return {
    add,
    newDeferred,
    start,
    deferredPromise: p,
  };
}
