export interface PromiseWithId<T = unknown> {
  promise: Promise<T>;
  id: string | number;
}

export type SettledPromise<Value = unknown, Reason = unknown> =
  | {resolved: true; value: Value}
  | {resolved: false; reason?: Reason};

export type SettledPromiseWithId<
  Value = unknown,
  Reason = unknown,
> = SettledPromise<Value, Reason> & {
  id: string | number;
};

export type InferPromiseWithIdData<T extends PromiseWithId> =
  T extends PromiseWithId<infer TData01> ? TData01 : unknown;

export type GetSettledPromise<
  T extends PromiseWithId,
  TData = InferPromiseWithIdData<T>,
> = SettledPromiseWithId<TData> &
  Pick<T, Exclude<keyof T, keyof SettledPromiseWithId>>;
