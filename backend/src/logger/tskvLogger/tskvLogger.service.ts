import { Injectable, LoggerService } from '@nestjs/common';

type LogMeta = Record<string, unknown>;

@Injectable()
export class TskvLogger implements LoggerService {
  private format(level: string, message: string, extra?: LogMeta) {
    const ts = new Date().toISOString();
    const kvs = [`time=${ts}`, `level=${level}`, `message=${message}`];

    if (extra) {
      for (const key in extra) {
        const value = extra[key];
        kvs.push(`${key}=${String(value)}`);
      }
    }

    return kvs.join('\t');
  }

  log(message: string, extra?: LogMeta) {
    console.log(this.format('log', message, extra));
  }

  warn(message: string, extra?: LogMeta) {
    console.warn(this.format('warn', message, extra));
  }

  error(message: string, extra?: LogMeta) {
    console.error(this.format('error', message, extra));
  }

  debug(message: string, extra?: LogMeta) {
    console.debug(this.format('debug', message, extra));
  }
}
