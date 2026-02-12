import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Film } from '../schemas/film.schema';

@Injectable()
export class FilmsRepository {
  constructor(
    @InjectModel(Film.name) private readonly filmModel: Model<Film>,
  ) {}

  async findAll() {
    return this.filmModel.find().lean().exec();
  }

  async findById(id: string) {
    return this.filmModel.findOne({ id }).lean().exec();
  }

  async updateFilm(filmId: string, update: Partial<Film>): Promise<Film> {
    const updatedFilm = await this.filmModel
      .findOneAndUpdate({ id: filmId }, update, { new: true })
      .exec();

    if (!updatedFilm) {
      throw new NotFoundException(`Фильм с id ${filmId} не найден`);
    }

    return updatedFilm.toObject();
  }
}
