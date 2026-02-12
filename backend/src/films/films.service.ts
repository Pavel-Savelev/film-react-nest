import { Injectable, Logger } from '@nestjs/common';
import { GetFilmDto, GetResponsFilmsDto } from './dto/films.dto';
import { ScheduleResponseDto, SessionDto } from './dto/films-schedule.dto';
import { FilmsRepository } from './repositories/film.repository';
import { Film } from './schemas/film.schema';
import { Schedule } from './schemas/film.schedule.schema';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);

  constructor(private readonly filmsRepository: FilmsRepository) {
    this.logger.log('FilmsService создан');
  }

  private toFilmDto(film: Film): GetFilmDto {
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

  private toScheduleDto(schedule: Schedule): SessionDto {
    const daytime =
      schedule.daytime instanceof Date
        ? schedule.daytime
        : new Date(schedule.daytime);
    return {
      id: schedule.id,
      daytime: daytime.toISOString(),
      hall: schedule.hall.toString(),
      rows: schedule.rows,
      seats: schedule.seats,
      price: schedule.price,
      taken: schedule.taken,
    };
  }

  async findAll(): Promise<GetResponsFilmsDto> {
    const films = await this.filmsRepository.findAll();
    const filmDto = films.map((film) => this.toFilmDto(film));
    return {
      total: films.length,
      items: filmDto,
    };
  }

  async findSchedule(filmId: string): Promise<ScheduleResponseDto> {
    const film = await this.filmsRepository.findById(filmId);
    console.log(film.id);
    const sessions = film.schedule.map((s) => this.toScheduleDto(s));

    return {
      total: sessions.length,
      items: sessions,
    };
  }
}
