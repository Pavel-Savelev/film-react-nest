import { Global, Module } from '@nestjs/common';
import { DevLogger } from './devLogger.service';

@Global()
@Module({
  providers: [DevLogger],
  exports: [DevLogger],
})
export class DevLoggerModule {}
