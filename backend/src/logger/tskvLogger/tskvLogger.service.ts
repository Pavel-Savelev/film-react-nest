import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private format(
    level: string,
    message: string,
    extra?: Record<string, string>,
  ) {
    const ts = new Date().toISOString();
    const kvs = [`time=${ts}`, `level=${level}`, `message=${message}`];
    if (extra) {
      for (const key in extra) {
        kvs.push(`${key}=${extra[key]}`);
      }
    }
    return kvs.join('\t');
  }

  log(message: string, extra?: Record<string, string>) {
    console.log(this.format('log', message, extra));
  }

  warn(message: string, extra?: Record<string, string>) {
    console.warn(this.format('warn', message, extra));
  }

  error(message: string, extra?: Record<string, string>) {
    console.error(this.format('error', message, extra));
  }

  debug(message: string, extra?: Record<string, string>) {
    console.debug(this.format('debug', message, extra));
  }
}
