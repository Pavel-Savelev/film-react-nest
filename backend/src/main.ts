import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { HybridLogger } from './logger/hybridLogger/hybridLogger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  // app.setGlobalPrefix('api/afisha');
  app.enableCors({
    origin: 'http://production-test.nomorepartiessite.ru',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });

  const hybridLogger = app.get(HybridLogger);
  app.useLogger(hybridLogger);

  await app.listen(3000);
}
bootstrap();
