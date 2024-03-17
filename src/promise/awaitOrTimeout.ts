import {TimeoutError} from '../errors/TimeoutError';

export async function awaitOrTimeout(
  promise: Promise<unknown>,
  timeoutMs: number
) {
  const timeoutHandle = setTimeout(() => {
    throw new TimeoutError();
  }, timeoutMs);

  try {
    return await promise;
  } finally {
    clearTimeout(timeoutHandle);
  }
}
