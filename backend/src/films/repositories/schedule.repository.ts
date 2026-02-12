import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Schedule } from '../schemas/film.schedule.schema';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectModel(Schedule.name) private readonly scheduleModel: Model<Schedule>,
  ) {}

  async findByFilmId(filmId: string): Promise<Schedule[]> {
    return this.scheduleModel.find({ filmId }).lean().exec();
  }
}
