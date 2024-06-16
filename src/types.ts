import {IsNever, UnionToIntersection} from 'type-fest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = {[k: string | number | symbol]: any};

export type ConvertT1ToT2Deep<T extends AnyObject, One, Two> = {
  [Key in keyof T]: T[Key] extends One
    ? Two
    : T[Key] extends unknown[]
      ? T[Key][0] extends One
        ? Two
        : T[Key][0] extends AnyObject
          ? ConvertT1ToT2Deep<T[Key][0], One, Two>
          : T[Key][0]
      : T[Key] extends AnyObject
        ? ConvertT1ToT2Deep<T[Key], One, Two>
        : T[Key];
};

export type ConvertDateToStringDeep<T extends AnyObject> = ConvertT1ToT2Deep<
  T,
  Date,
  string
>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFn<Args extends any[] = any[], Result = any> = (
  ...args: Args
) => Result;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyAsyncFn<Args extends any[] = any[], Result = any> = (
  ...args: Args
) => Promise<Result>;

export type EmptyObject = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ClassConstructor = new (...args: any) => any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractClassConstructor = abstract new (...args: any) => any;

export type PartialRecord<K extends string | number | symbol, T> = {
  [P in K]?: T;
};

export type InferTypeFromArray<T> = T extends Array<infer T1> ? T1 : T;

export type InvertRecord<TRecord> = TRecord extends Record<infer K, infer V>
  ? V extends string | number | symbol
    ? Record<V, K>
    : Record<string, K>
  : never;

export type DefaultTo<
  T,
  TDefault,
  TDefaultFrom = undefined,
> = T extends TDefaultFrom ? TDefault : T;

export type StringKeysOnly<TData> = keyof TData extends string
  ? keyof TData
  : '';

export type OrArray<TData> = TData | Array<TData>;

export type OrPromise<TData> = TData | Promise<TData>;

export type OmitFrom<T, TKeys extends keyof T> = Omit<T, TKeys>;

export type IsUnion<T> = UnionToIntersection<T> extends never
  ? true
  : IsNever<Exclude<keyof UnionToIntersection<T>, keyof T>> extends true
    ? false
    : true;

/**
 *  type IsUnion<T, U extends T = T> =
      T extends unknown ? [U] extends [T] ? false : true : false;
 */

type LastOf<T> = UnionToIntersection<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Push<T extends any[], V> = [...T, V];

export type UnionToTuple<
  T,
  TLast = LastOf<T>,
  TNever = [T] extends [never] ? true : false,
> = true extends TNever ? [] : Push<UnionToTuple<Exclude<T, TLast>>, TLast>;

export type IsStringEnum<T> = IsNever<
  IsUnion<T> & (T | string extends string ? true : false)
> extends true
  ? false
  : true;

export type Not<T extends boolean> = T extends true ? false : true;

export type IsBoolean<T> = T extends boolean ? true : false;
