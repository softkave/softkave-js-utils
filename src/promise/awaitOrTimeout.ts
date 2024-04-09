/** Expects that you handle `catch()` and stragling promises (cases where it
 * times out) on your own */
export async function awaitOrTimeout<
  TPromise extends Promise<unknown>,
  TResult = TPromise extends Promise<infer Value> ? Value : unknown,
>(promise: TPromise, timeoutMs: number) {
  return new Promise<{timedout: true} | {timedout: false; result: TResult}>(
    resolve => {
      const timeoutHandle = setTimeout(() => {
        resolve({timedout: true});
      }, timeoutMs);

      promise.then(result => {
        clearTimeout(timeoutHandle);
        resolve({timedout: false, result: result as unknown as TResult});
      });
    }
  );
}
