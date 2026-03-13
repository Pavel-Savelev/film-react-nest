import { Global, Module } from '@nestjs/common';
import { HybridLogger } from './hybridLogger.service';
import { TskvLoggerModule } from '../tskvLogger/tskvLogger.module';
import { JsonLoggerModule } from '../jsonLogger/jsonLogger.module';
import { DevLoggerModule } from '../devLogger/devLogger.module';

@Global()
@Module({
  imports: [DevLoggerModule, JsonLoggerModule, TskvLoggerModule],
  providers: [HybridLogger],
  exports: [HybridLogger],
})
export class HybridLoggerModule {}
