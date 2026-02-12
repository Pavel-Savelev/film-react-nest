import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  ConfirmedOrder,
  CreateOrderItemDto,
  CreateOrderResponseDto,
} from './dto/create-order.dto';
import { OrderRepository } from './repositories/order.repository';
import { FilmsRepository } from 'src/films/repositories/film.repository';
import { OrderDocument } from './order.types';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly filmsRepository: FilmsRepository,
  ) {
    this.logger.log('OrderService создан');
  }
  private async checkSeatAvailability(
    filmId: string,
    sessionId: string,
    daytime: string,
    seat: number,
    row: number,
  ): Promise<boolean> {
    const film = await this.filmsRepository.findById(filmId);

    if (!film) {
      throw new NotFoundException(`Фильм с таким id не найден - ${filmId}`);
    }

    const targetTime = new Date(daytime).getTime();
    const session = (film.schedule || []).find(
      (s) => new Date(s.daytime).getTime() === targetTime,
    );

    if (!session) {
      throw new NotFoundException(
        `Сессий с таким id не найдено - ${sessionId}`,
      );
    }

    if (row > session.rows || seat > session.seats || row < 1 || seat < 1) {
      throw new NotFoundException(`Ошибка выбора места`);
    }

    const seatPosition = `${row}:${seat}`;
    const isTaken = session.taken?.includes(seatPosition) || false;

    session.taken = [...(session.taken || []), seatPosition];

    await this.filmsRepository.updateOne(
      { id: filmId, 'schedule.daytime': new Date(daytime) },
      { $addToSet: { 'schedule.$.taken': seatPosition } },
    );

    return !isTaken;
  }

  private async takeSeat(
    filmId: string,
    sessionId: string,
    seat: number,
    daytime: string,
    row: number,
  ): Promise<void> {
    const isAvailable = await this.checkSeatAvailability(
      filmId,
      sessionId,
      daytime,
      seat,
      row,
    );

    if (!isAvailable) {
      throw new BadRequestException(`Место ${seat}:${row} занято`);
    }

    const seatPosition = `${row}:${seat}`;

    await this.orderRepository.takeSeat(filmId, sessionId, seatPosition);
  }

  private toMongoDocument(item: CreateOrderItemDto) {
    return {
      film: item.film,
      session: item.session,
      daytime: new Date(item.daytime),
      row: item.row,
      seat: item.seat,
      price: item.price,
    };
  }

  private toResponseDto(order: OrderDocument): ConfirmedOrder {
    return {
      id: order.id.toString(),
      film: order.film,
      session: order.session,
      daytime: order.daytime.toISOString(),
      row: order.row,
      seat: order.seat,
      price: order.price,
    };
  }

  async createOrders(
    orderItems: CreateOrderItemDto[],
  ): Promise<CreateOrderResponseDto> {
    try {
      for (const item of orderItems) {
        const isAvailable = await this.checkSeatAvailability(
          item.film,
          item.session,
          item.daytime,
          item.seat,
          item.row,
        );

        if (!isAvailable) {
          throw new BadRequestException(
            `Место ${item.row}:${item.seat} уже занято`,
          );
        }
      }

      for (const item of orderItems) {
        await this.takeSeat(
          item.film,
          item.session,
          item.seat,
          item.daytime,
          item.row,
        );
      }

      const docsToCreate = orderItems.map((item) => this.toMongoDocument(item));
      const createdOrders =
        await this.orderRepository.createOrders(docsToCreate);

      const responseItems = createdOrders.map((order) =>
        this.toResponseDto(order),
      );

      return {
        total: responseItems.length,
        items: responseItems,
      };
    } catch (error) {
      throw error;
    }
  }
}
