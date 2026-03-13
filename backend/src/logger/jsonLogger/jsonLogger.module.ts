import { Global, Module } from '@nestjs/common';
import { JsonLogger } from './jsonLogger.service';

@Global()
@Module({
  providers: [JsonLogger],
  exports: [JsonLogger],
})
export class JsonLoggerModule {}
