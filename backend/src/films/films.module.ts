import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './schemas/film.schema';
import { FilmsRepository } from './repositories/film.repository'; // ← импорт
import { ScheduleRepository } from './repositories/schedule.repository';
import { Schedule, ScheduleSchema } from './schemas/film.schedule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
    MongooseModule.forFeature([
      { name: Schedule.name, schema: ScheduleSchema },
    ]),
  ],
  controllers: [FilmsController],
  providers: [FilmsService, FilmsRepository, ScheduleRepository],
  exports: [FilmsService, FilmsRepository, ScheduleRepository],
})
export class FilmsModule {}
