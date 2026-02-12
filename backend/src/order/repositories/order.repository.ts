import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { Film } from '../../films/scрemas/film.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(Film.name) private filmModel: Model<Film>,
  ) {}

  async findFilmById(filmId: string) {
    return this.filmModel.findOne({ id: filmId }).lean().exec();
  }

  async takeSeat(filmId: string, sessionId: string, seatPosition: string) {
    return this.filmModel
      .updateOne(
        { id: filmId, 'schedule.id': sessionId },
        { $push: { 'schedule.$.taken': seatPosition } },
      )
      .exec();
  }

  async createOrders(ordersData: any[]) {
    return this.orderModel.create(ordersData);
  }
}
