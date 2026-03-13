import { Global, Module } from '@nestjs/common';
import { TskvLogger } from './tskvLogger.service';

@Global()
@Module({
  providers: [TskvLogger],
  exports: [TskvLogger],
})
export class TskvLoggerModule {}
