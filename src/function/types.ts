/**
 * - `all` - uses `Promise.all()`
 * - `allSettled` - uses `Promise.allSettled()`
 * - `oneByOne` - invokes and waits for `fn` one at a time
 */
export type LoopAsyncSettlementType = 'all' | 'allSettled' | 'oneByOne';
