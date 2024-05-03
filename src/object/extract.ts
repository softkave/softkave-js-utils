/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import {isFunction, pick} from 'lodash-es';
import {cast} from '../other/index.js';

export type ExtractFieldTransformer<
  T,
  TResult = any,
  TExtraArgs = any,
  TData = any,
> = (val: T, extraArgs: TExtraArgs, data: TData) => TResult;

export type ExtractFieldsDefaultScalarTypes =
  | undefined
  | boolean
  | string
  | number
  | bigint
  | symbol
  | null
  | Date;

export type ExtractFieldsFrom<
  T extends object,
  TResult extends Record<keyof T, any> = T,
  TExtraArgs = undefined,
  TScalarTypes = ExtractFieldsDefaultScalarTypes,
> = {
  [Key in keyof Required<T>]: T[Key] extends TScalarTypes | TScalarTypes[]
    ? boolean | ExtractFieldTransformer<T[Key], TResult[Key], TExtraArgs, T>
    : ExtractFieldTransformer<T[Key], TResult[Key], TExtraArgs, T>;
};

export interface ExtractObjectPaths<
  T extends object,
  TResult extends Record<keyof T, any> = T,
  TExtraArgs = any,
> {
  object: T;
  extraArgs: TExtraArgs;
  result: TResult;
  scalarFields: string[];
  scalarFieldsWithTransformers: Array<{
    property: string;
    transformer: ExtractFieldTransformer<any>;
  }>;
  finalize?: (
    data: T,
    currentResult: TResult,
    extraArgs: TExtraArgs
  ) => TResult;
}

export function getExtractFields<
  T extends object,
  TResult extends Record<keyof T, any> = T,
  TExtraArgs = any,
  TScalarTypes = ExtractFieldsDefaultScalarTypes,
>(
  data: ExtractFieldsFrom<T, TResult, TExtraArgs, TScalarTypes>,
  finalizeFn?: (
    data: T,
    currentResult: TResult,
    extraArgs: TExtraArgs
  ) => TResult
): ExtractObjectPaths<T, TResult, TExtraArgs> {
  const keys = Object.keys(data) as Array<keyof typeof data>;
  return keys.reduce(
    (paths, key) => {
      const value = data[key];
      if (isFunction(value)) {
        paths.scalarFieldsWithTransformers.push({
          property: key as string,
          transformer: value,
        });
      } else {
        paths.scalarFields.push(key as string);
      }

      return paths;
    },
    {
      scalarFields: [],
      scalarFieldsWithTransformers: [],
      object: cast<T>({}),
      extraArgs: cast<TExtraArgs>({}),
      result: cast<TResult>({}),
      finalize: finalizeFn,
    } as ExtractObjectPaths<T, TResult, TExtraArgs>
  );
}

export function extractFields<
  TObjectPaths extends ExtractObjectPaths<any>,
  TData extends Partial<
    Record<keyof TObjectPaths['object'], any>
  > = TObjectPaths['object'],
>(
  data: TData,
  paths: TObjectPaths,
  extraArgs?: TObjectPaths['extraArgs']
): TObjectPaths['result'] {
  let result = pick(data, paths.scalarFields);
  paths.scalarFieldsWithTransformers.forEach(({property, transformer}) => {
    const propValue = data[property];

    if (propValue === undefined) {
      return;
    }

    result[property] =
      propValue === null ? null : transformer(propValue, extraArgs, data);
  });

  if (paths.finalize) {
    result = paths.finalize(data, result, extraArgs);
  }

  return result as unknown as TObjectPaths['result'];
}

// TODO: make extract simpler
export function makeExtract<T extends ExtractObjectPaths<any>>(fields: T) {
  const fn = <T1 extends T['object']>(data: Partial<Record<keyof T1, any>>) => {
    return extractFields(data, fields);
  };

  return fn;
}

export function makeExtractIfPresent<T extends ExtractObjectPaths<any>>(
  fields: T
) {
  const fn = <T1 extends T['object']>(
    data?: Partial<Record<keyof T1, any>>
  ) => {
    return data && extractFields(data, fields);
  };

  return fn;
}

export function makeListExtract<T extends ExtractObjectPaths<any>>(fields: T) {
  const fn = <T1 extends T['object']>(
    data: Partial<Record<keyof T1, any>>[]
  ) => {
    return data.map(datum => extractFields(datum, fields));
  };

  return fn;
}
