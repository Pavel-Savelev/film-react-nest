import { LoggerService, Injectable } from '@nestjs/common';
import { LogMeta } from '../hybridLogger/hybridLogger.service';

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(level: string, message: string, ...optionalParams: LogMeta[]) {
    return JSON.stringify({ level, message, optionalParams });
  }

  warn(message: string, ...optionalParams: LogMeta[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  log(message: string, ...optionalParams: LogMeta[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: string, ...optionalParams: LogMeta[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  debug(message: string, ...optionalParams: LogMeta[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }
}
