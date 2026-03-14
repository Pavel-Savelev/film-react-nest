import { Module } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Film, FilmSchema } from './shcemas/film.schema';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
})
export class FilmsModule {}
