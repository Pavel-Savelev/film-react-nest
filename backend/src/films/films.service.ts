import { Injectable } from '@nestjs/common';
import { GetFilmDto, GetResponsFilmsDto } from './dto/films.dto';
import { ScheduleResponseDto, SessionDto } from './dto/films-schedule.dto';
import { FilmsRepository } from 'src/repositories/film.repository';
import { Film } from './entities/film.entity';
import { Schedule } from './entities/schedule.entity';
import { HybridLogger } from 'src/logger/hybridLogger/hybridLogger.service';

@Injectable()
export class FilmsService {
  constructor(
    private readonly filmsRepository: FilmsRepository,
    private readonly logger: HybridLogger,
  ) {
    this.logger.log('FilmsService initialized');
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
    this.logger.debug('Fetching films');

    const films = await this.filmsRepository.findAll();
    const filmDto = films.map((film) => this.toFilmDto(film));
    this.logger.log(`Films fetched total: ${films.length}`);
    return {
      total: films.length,
      items: filmDto,
    };
  }

  async findSchedule(filmId: string): Promise<ScheduleResponseDto> {
    this.logger.debug(`Fetching schedule for film ${filmId}`);

    const film = await this.filmsRepository.findByFilmId(filmId);
    if (!film) {
      this.logger.warn(`Film ${filmId} not found`);
      throw new Error(`Film ${filmId} not found`);
    }
    const sessions = film.schedules.map((s) => this.toScheduleDto(s));
    if (sessions.length === 0) {
      this.logger.warn(`Film ${filmId} has no sessions`);
    }

    this.logger.log(`Film ${filmId} sessions total: ${sessions.length}`);
    return {
      total: sessions.length,
      items: sessions,
    };
  }
}
