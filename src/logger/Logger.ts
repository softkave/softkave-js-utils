import {ValueOf} from 'type-fest';
import {DisposableResource} from '../other/disposables';

export interface Logger extends DisposableResource {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export const kLoggerTypes = {
  console: 'console',
  noop: 'noop',
} as const;

export type LoggerType = ValueOf<typeof kLoggerTypes>;
