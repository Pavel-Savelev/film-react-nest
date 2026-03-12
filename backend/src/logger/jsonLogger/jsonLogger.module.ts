import { Global, Module } from '@nestjs/common';
import { JsonLogger } from './JsonLogger.service';

@Global()
@Module({
  providers: [JsonLogger],
  exports: [JsonLogger],
})
export class JsonLoggerModule {}
