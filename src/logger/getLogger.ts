import {Logger, LoggerType, kLoggerTypes} from './Logger';
import {NoopLogger} from './NoopLogger';

export function getLogger(type: LoggerType = kLoggerTypes.noop): Logger {
  switch (type) {
    case kLoggerTypes.console:
      return console;
    case kLoggerTypes.noop:
    default:
      return new NoopLogger();
  }
}
