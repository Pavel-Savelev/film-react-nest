import { Global, Module } from '@nestjs/common';
import { TskvLogger } from './TskvLogger.service';

@Global()
@Module({
  providers: [TskvLogger],
  exports: [TskvLogger],
})
export class TskvLoggerModule {}
