import { Injectable, Logger } from '@nestjs/common';
import { GetFilmDto } from './dto/films.dto';
import { SessionDto } from './dto/films-schedule.dto';
import { FilmsRepository } from './repositories/film.repository';
import { ScheduleRepository } from './repositories/schedule.repository';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);

  constructor(
    private readonly filmsRepository: FilmsRepository,
    private readonly scheduleRepository: ScheduleRepository,
  ) {
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
    const films = await this.filmsRepository.findAll();
    const filmDto = films.map((film) => this.toFilmDto(film));
    return {
      total: films.length,
      items: filmDto,
    };
  }

  async findSchedule(filmId: string) {
    const schedule = await this.scheduleRepository.findByFilmId(filmId);
    const sessionDtos = schedule.map((s) => this.toScheduleDto(s));

    return {
      total: sessionDtos.length,
      items: sessionDtos,
    };
  }
}
