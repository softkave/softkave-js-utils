import {ValueOf} from 'type-fest';

export const kLoopAsyncSettlementType = {
  /** `all` - uses `Promise.all()` */
  all: 'a',
  /** `allSettled` - uses `Promise.allSettled()` */
  allSettled: 's',
  /** `oneByOne` - invokes and waits for `fn` one at a time */
  oneByOne: 'o',
} as const;

export type LoopAsyncSettlementType = ValueOf<typeof kLoopAsyncSettlementType>;
