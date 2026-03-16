import { Injectable } from '@nestjs/common';
import { DevLogger } from '../../logger/devLogger/devLogger.service';
import { JsonLogger } from '../../logger/jsonLogger/jsonLogger.service';
import { TskvLogger } from '../tskvLogger/tskvLogger.service';

export type LogMeta = Record<string, unknown>;

@Injectable()
export class HybridLogger {
  constructor(
    private readonly devLogger: DevLogger,
    private readonly jsonLogger: JsonLogger,
    private readonly tskvLogger: TskvLogger,
  ) {}

  log(message: string, ...optionalParams: LogMeta[]) {
    this.devLogger.log(message, ...optionalParams);
    this.jsonLogger.log(message, ...optionalParams);
    this.tskvLogger.log(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: LogMeta[]) {
    this.devLogger.warn(message, ...optionalParams);
    this.jsonLogger.warn(message, ...optionalParams);
    this.tskvLogger.warn(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: LogMeta[]) {
    this.devLogger.error(message, ...optionalParams);
    this.jsonLogger.error(message, ...optionalParams);
    this.tskvLogger.error(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: LogMeta[]) {
    if (this.devLogger.debug) this.devLogger.debug(message, ...optionalParams);
    if (this.jsonLogger.debug) this.jsonLogger.log(message, ...optionalParams);
    if (this.tskvLogger.debug) this.tskvLogger.log(message, ...optionalParams);
  }
}
