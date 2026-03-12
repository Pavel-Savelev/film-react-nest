import { Injectable } from '@nestjs/common';
import { DevLogger } from 'src/logger/devLogger/devLogger.service';
import { JsonLogger } from 'src/logger/jsonLogger/jsonLogger.service';
import { TskvLogger } from '../tskvLogger/tskvLogger.service';

@Injectable()
export class HybridLogger {
  constructor(
    private readonly devLogger: DevLogger,
    private readonly jsonLogger: JsonLogger,
    private readonly tskvLogger: TskvLogger,
  ) {}

  log(message: any, ...optionalParams: any[]) {
    this.devLogger.log(message, ...optionalParams);
    this.jsonLogger.log(message, ...optionalParams);
    this.tskvLogger.log(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.devLogger.warn(message, ...optionalParams);
    this.jsonLogger.warn(message, ...optionalParams);
    this.tskvLogger.warn(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.devLogger.error(message, ...optionalParams);
    this.jsonLogger.error(message, ...optionalParams);
    this.tskvLogger.error(message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    if (this.devLogger.debug) this.devLogger.debug(message, ...optionalParams);
    if (this.jsonLogger.debug) this.jsonLogger.log(message, ...optionalParams);
    if (this.tskvLogger.debug) this.tskvLogger.log(message, ...optionalParams);
  }
}
