import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';

export class FilmNotFoundError extends Error {
  constructor() {
    super('films not found');
  }
}

export class SessionNotFoundError extends Error {
  constructor() {
    super('session not found');
  }
}

export class SeatConflictError extends Error {
  constructor() {
    super('seat conflict');
  }
}

@Injectable()
export class FilmsRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Film)
    private readonly filmRepo: Repository<Film>,
  ) {}

  async findAll(): Promise<Film[]> {
    return this.filmRepo.find();
  }

  async findAllWithSchedules(): Promise<Film[]> {
    return this.filmRepo.find({
      relations: { schedules: true },
    });
  }

  async findByFilmId(filmId: string): Promise<Film | null> {
    return this.filmRepo.findOne({
      where: { id: filmId },
      relations: { schedules: true },
    });
  }

  async reserveSeats(
    filmId: string,
    sessionId: string,
    seatKeys: string[],
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const schedule = await manager.getRepository(Schedule).findOne({
        where: { id: sessionId, filmId: filmId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!schedule) {
        const filmExists = await manager
          .getRepository(Film)
          .exist({ where: { id: filmId } });

        if (!filmExists) throw new FilmNotFoundError();
        throw new SessionNotFoundError();
      }

      const takenArr = Array.isArray(schedule.taken) ? schedule.taken : [];
      const takenSet = new Set(takenArr);

      const hasConflict = seatKeys.some((k) => takenSet.has(k));
      if (hasConflict) throw new SeatConflictError();

      seatKeys.forEach((k) => takenSet.add(k));
      schedule.taken = Array.from(takenSet);

      await manager.getRepository(Schedule).save(schedule);
    });
  }
}
