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

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly orderRepository: OrderRepository) {
    this.logger.log('OrderService создан');
  }
  private async checkSeatAvailability(
    filmId: string,
    sessionId: string,
    seat: number,
    row: number,
  ): Promise<boolean> {
    const film = await this.orderRepository.findFilmById(filmId);

    if (!film) {
      throw new NotFoundException(`Фильм с таким id не найден - ${filmId}`);
    }

    const session = await film.schedule?.find((item) => item.id === sessionId);
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

    return !isTaken;
  }

  private async takeSeat(
    filmId: string,
    sessionId: string,
    seat: number,
    row: number,
  ): Promise<void> {
    const isAvailable = await this.checkSeatAvailability(
      filmId,
      sessionId,
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

  private toResponseDto(order: any): ConfirmedOrder {
    return {
      id: order._id.toString(),
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
        await this.takeSeat(item.film, item.session, item.seat, item.row);
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
