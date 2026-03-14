import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from './shcemas/film.schema';
import { GetFilmDto } from './dto/films.dto';
import { SessionDto } from './dto/films-schedule.dto';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);

  constructor(@InjectModel(Film.name) private filmModel: Model<Film>) {
    this.logger.log('FilmsService создан');
  }

  private toFilmDto(film: any): GetFilmDto {
    return {
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: film.tags || [],
      title: film.title,
      about: film.about,
      description: film.description,
      image: film.image,
      cover: film.cover,
    };
  }

  private toScheduleDto(schedule: any): SessionDto {
    return {
      id: schedule.id,
      daytime: schedule.daytime,
      hall: schedule.hall,
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }

  async findAll() {
    const films = await this.filmModel.find().lean().exec();
    const filmDto = films.map((film) => this.toFilmDto(film));
    return {
      total: films.length,
      items: filmDto,
    };
  }

  async findSchedule(id: string) {
    const film = await this.filmModel.findOne({ id: id }).lean().exec();

    if (!film) {
      throw new NotFoundException(`Фильм с ID ${id} не найден`);
    }

    const schedule = film.schedule || [];
    const sessionDtos = schedule.map((film) => this.toScheduleDto(film));

    return {
      total: sessionDtos.length,
      items: sessionDtos,
    };
  }
}
