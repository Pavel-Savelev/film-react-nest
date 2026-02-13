import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';

import { configProvider } from './app.config.provider';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>(
          'MONGODB_URI',
          'mongodb://localhost:27017/afisha',
        );
        console.log(`Подключаемся к MongoDB: ${uri}`);

        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              console.log(' MongoDB  подключена');
            });
            connection.on('error', (err) => {
              console.error('Ошибка подключения MongoDB', err.message);
            });
            connection.on('disconnected', () => {
              console.log('MongoDB отключена');
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),

    FilmsModule,
    OrderModule,
  ],
  providers: [configProvider],
})
export class AppModule {}
