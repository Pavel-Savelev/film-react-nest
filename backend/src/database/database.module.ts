import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

type DbDriver = 'postgres';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        if (!url) {
          throw new Error('DATABASE_URL is not defined');
        }

        const parsed = new URL(url);
        const driver = (config.get<string>('DATABASE_DRIVER') ||
          'postgres') as DbDriver;

        return {
          type: driver,
          host: parsed.hostname,
          port: Number(parsed.port) || 5432,
          database: parsed.pathname.replace('/', ''),
          username: config.get<string>('DATABASE_USERNAME'),
          password: config.get<string>('DATABASE_PASSWORD'),
          synchronize: true,
          entities: [Film, Schedule],
        };
      },
    }),

    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
