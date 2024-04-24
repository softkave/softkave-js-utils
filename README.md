# Softkave JS Utils

## Overview

Collection of JavaScript and Typescript utilities.

## Install

For `npm`

```sh
npm install softkave-js-utils
```

For `yarn`

```sh
yarn add softkave-js-utils
```

## Jest Issues

If you're having issues using `softkave-js-utils` with `jest` and you're using `ts-jest`, add the following to your `jest` config file (e.g `jest.config.js`). The issue is with ES module packages used by `softkave-js-utils` which needs to be transformed to `commonjs`. `jest`'s error messages will usually tell you the offending package so you can add them to `transformIgnorePatterns`.

```json
{
  "transformIgnorePatterns": ["/node_modules/(?!(nanoid)/)"]
}
```

If you're using Typescript, also confirm your `ts-config`'s `compileOptions`'s `rootDir` includes `node_modules`, or create a separate `ts-config` for testing that extends your project's `ts-config` and includes `node_modules` in it's `rootDir`. You don't need to add `node_modules` to `include`, it just needs to be covered in `rootDir`.

```json
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "rootDir": ".",
    "allowJs": true
  },
  "include": ["src/**/*.ts"]
}
```

## Exports

### Functions

- `array`
  - [`convertToArray`](./src/array/convertToArray.ts)
  - [`defaultToArray`](./src/array/defaultToArray.ts)
  - [`indexArray`](./src/array/indexArray.ts)
  - [`toCompactArray`](./src/array/toCompactArray.ts)
  - [`toUniqArray`](./src/array/toUniqArray.ts)
- `error`
  - [`TimeoutError`](./src/error/TimeoutError.ts)
- `function`
  - [`callAfterAsync`](./src/function/callAfterAsync.ts)
  - [`getFirstArg`](./src/function/getFirstArg.ts)
  - [`identityArgs`](./src/function/identityArgs.ts)
  - [`loop`](./src/function/loop.ts)
  - [`loopAndCollate`](./src/function/loopAndCollate.ts)
  - [`loopAndCollateAsync`](./src/function/loopAndCollateAsync.ts)
  - [`loopAsync`](./src/function/loopAsync.ts)
  - [`noopAsync`](./src/function/noopAsync.ts)
  - [`overArgsAsync`](./src/function/overArgsAsync.ts)
  - [`singleton`](./src/function/singleton.ts)
- `id`
  - [`getId0`](./src/id/getId0.ts)
  - [`getNewId`](./src/id/getNewId.ts)
  - [`getNewIdWithShortName`](./src/id/getNewIdWithShortName.ts)
  - [`getShortNameFromId`](./src/id/getShortNameFromId.ts)
  - [`isIdWithShortName`](./src/id/isIdWithShortName.ts)
  - [`padIdWithShortName`](./src/id/padIdWithShortName.ts)
  - [`tryGetShortNameFromId`](./src/id/tryGetShortNameFromId.ts)
- `logger`
  - [`getLogger`](./src/logger/getLogger.ts)
  - [`Logger`](./src/logger/Logger.ts)
  - [`NoopLogger`](./src/logger/NoopLogger.ts)
- `number`
  - [`getRandomArbitrary`](./src/number/getRandomArbitrary.ts)
  - [`getRandomInt`](./src/number/getRandomInt.ts)
  - [`getRandomIntInclusive`](./src/number/getRandomIntInclusive.ts)
- `object`
  - [`applyMixins`](./src/object/applyMixins.ts)
  - [`areObjectFieldsEmpty`](./src/object/areObjectFieldsEmpty.ts)
  - [`extract`](./src/object/extract.ts)
  - [`isObjectEmpty`](./src/object/isObjectEmpty.ts)
  - [`mergeObjects`](./src/object/mergeObjects.ts)
  - [`omitDeep`](./src/object/omitDeep.ts)
  - [`reverseMap`](./src/object/reverseMap.ts)
- `other`
  - [`calculateMaxPages`](./src/other/calculateMaxPages.ts)
  - [`calculatePageSize`](./src/other/calculatePageSize.ts)
  - [`cast`](./src/other/cast.ts)
  - [`combineTokens`](./src/other/combineTokens.ts)
  - [`disposables`](./src/other/disposables.ts)
  - [`ListenableResource`](./src/other/ListenableResource.ts)
  - [`LockStore`](./src/other/LockStore.ts)
  - [`waitTimeout`](./src/other/waitTimeout.ts)
- `promise`
  - [`awaitOrTimeout`](./src/promise/awaitOrTimeout.ts)
  - [`getDeferredPromise`](./src/promise/getDeferredPromise.ts)
  - [`PromiseStore`](./src/promise/PromiseStore.ts)
  - [`settlePromise`](./src/promise/settlePromise.ts)
  - [`settlePromiseList`](./src/promise/settlePromiseList.ts)
  - [`settlePromiseListWithId`](./src/promise/settlePromiseListWithId.ts)
  - [`settlePromiseWithId`](./src/promise/settlePromiseWithId.ts)
- `string`
  - [`capitalizeFirstLetter`](./src/string/capitalizeFirstLetter.ts)
  - [`getIgnoreCaseRegExpForString`](./src/string/getIgnoreCaseRegExpForString.ts)
  - [`isLowercaseEqual`](./src/string/isLowercaseEqual.ts)
  - [`makeStringKey`](./src/string/makeStringKey.ts)
  - [`multilineTextToParagraph`](./src/string/multilineTextToParagraph.ts)
  - [`path`](./src/string/path.ts)
  - [`sortStringListLexicographically`](./src/string/sortStringListLexicographically.ts)
  - [`uncapitalizeFirstLetter`](./src/string/uncapitalizeFirstLetter.ts)
- `testing`
  - [`assertErrorHasName`](./src/testing/assertErrorHasName.ts)
  - [`expectErrorThrown`](./src/testing/expectErrorThrown.ts)
- [`constants`](./src/constants.ts)

### Type Utilities

- `AnyObject`
- `ConvertT1ToT2Deep`
- `ConvertDateToStringDeep`
- `AnyFn`
- `AnyAsyncFn`
- `EmptyObject`
- `ClassConstructor`
- `AbstractClassConstructor`
- `PartialRecord`
- `InferTypeFromArray`
- `InvertRecord`
- `DefaultTo`
- `StringKeysOnly`
- `OrArray`
- `OrPromise`
- `OmitFrom`
- `IsUnion`
- `UnionToTuple`
- `IsStringEnum`
- `Not`
- `IsBoolean`
