import {noop} from 'lodash';
import {Logger} from './Logger.js';

export class NoopLogger implements Logger {
  log: (...args: unknown[]) => void = noop;
  error: (...args: unknown[]) => void = noop;
}
