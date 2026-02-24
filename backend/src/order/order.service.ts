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
import { FilmsRepository } from 'src/repositories/film.repository'; // исправлен путь
import { v4 as uuidv4 } from 'uuid'; // для генерации ID заказов

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly filmsRepository: FilmsRepository) {
    this.logger.log('OrderService создан');
  }

  private async checkSeatAvailability(
    filmId: string,
    sessionId: string,
    seat: number,
    row: number,
  ): Promise<{ available: boolean; schedule?: any }> {
    const film = await this.filmsRepository.findByFilmId(filmId);

    if (!film) {
      throw new NotFoundException(`Фильм с id ${filmId} не найден`);
    }

    const session = film.schedules?.find((s) => s.id === sessionId);

    if (!session) {
      throw new NotFoundException(`Сеанс с id ${sessionId} не найден`);
    }

    if (row > session.rows || seat > session.seats || row < 1 || seat < 1) {
      throw new BadRequestException(
        `Некорректное место: ряд ${row}, место ${seat}`,
      );
    }

    const seatPosition = `${row}:${seat}`;
    const isTaken = session.taken?.includes(seatPosition) || false;

    return {
      available: !isTaken,
      schedule: session,
    };
  }

  private toResponseDto(
    item: CreateOrderItemDto,
    orderId: string,
  ): ConfirmedOrder {
    return {
      id: orderId,
      film: item.film,
      session: item.session,
      daytime: item.daytime,
      row: item.row,
      seat: item.seat,
      price: item.price,
    };
  }

  async createOrders(
    orderItems: CreateOrderItemDto[],
  ): Promise<CreateOrderResponseDto> {
    try {
      this.logger.log(`Создание заказа для ${orderItems.length} билетов`);

      for (const item of orderItems) {
        const { available } = await this.checkSeatAvailability(
          item.film,
          item.session,
          item.seat,
          item.row,
        );

        if (!available) {
          throw new BadRequestException(
            `Место ряд ${item.row}, место ${item.seat} уже занято`,
          );
        }
      }

      const sessionsMap = new Map<string, string[]>();

      for (const item of orderItems) {
        const key = `${item.film}:${item.session}`;
        const seatKey = `${item.row}:${item.seat}`;

        if (!sessionsMap.has(key)) {
          sessionsMap.set(key, []);
        }
        sessionsMap.get(key)!.push(seatKey);
      }

      for (const [key, seats] of sessionsMap) {
        const [filmId, sessionId] = key.split(':');
        await this.filmsRepository.reserveSeats(filmId, sessionId, seats);
      }

      const responseItems: ConfirmedOrder[] = orderItems.map((item) => {
        const orderId = uuidv4(); // генерируем уникальный ID для каждого билета
        return this.toResponseDto(item, orderId);
      });

      return {
        total: responseItems.length,
        items: responseItems,
      };
    } catch (error) {
      this.logger.error(`Ошибка при создании заказа: ${error.message}`);
      throw error;
    }
  }
}
