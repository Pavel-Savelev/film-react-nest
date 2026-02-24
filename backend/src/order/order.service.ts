import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  ConfirmedOrder,
  CreateOrderItemDto,
  CreateOrderResponseDto,
} from './dto/create-order.dto';
import { FilmsRepository } from '../repositories/film.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(private readonly filmsRepository: FilmsRepository) {
    this.logger.log('OrderService инициализирован');
  }

  private async validateSeatAvailability(
    filmId: string,
    sessionId: string,
    seat: number,
    row: number,
  ): Promise<{ available: boolean; session?: any }> {
    const film = await this.filmsRepository.findByFilmId(filmId);

    if (!film) {
      throw new NotFoundException(`Фильм с ID ${filmId} не найден`);
    }

    const session = film.schedules?.find((s) => s.id === sessionId);

    if (!session) {
      throw new NotFoundException(`Сеанс с ID ${sessionId} не найден`);
    }

    if (row < 1 || row > session.rows) {
      throw new BadRequestException(
        `Некорректный ряд: ${row}. Допустимые ряды: 1-${session.rows}`,
      );
    }

    if (seat < 1 || seat > session.seats) {
      throw new BadRequestException(
        `Некорректное место: ${seat}. Допустимые места: 1-${session.seats}`,
      );
    }

    const seatPosition = `${row}:${seat}`;
    const isTaken = session.taken?.includes(seatPosition) || false;

    return {
      available: !isTaken,
      session,
    };
  }

  private validateOrderItems(orderItems: CreateOrderItemDto[]): void {
    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException('Заказ не может быть пустым');
    }

    const seatKeys = new Set<string>();
    for (const item of orderItems) {
      const key = `${item.film}:${item.session}:${item.row}:${item.seat}`;

      if (seatKeys.has(key)) {
        throw new BadRequestException(
          `Обнаружен дубликат места: фильм ${item.film}, сеанс ${item.session}, ряд ${item.row}, место ${item.seat}`,
        );
      }
      seatKeys.add(key);
    }

    for (const item of orderItems) {
      if (item.price <= 0) {
        throw new BadRequestException(
          `Некорректная цена: ${item.price}. Цена должна быть положительным числом`,
        );
      }
    }
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

      this.validateOrderItems(orderItems);

      const availabilityChecks = await Promise.all(
        orderItems.map(async (item) => {
          const { available, session } = await this.validateSeatAvailability(
            item.film,
            item.session,
            item.seat,
            item.row,
          );
          return {
            ...item,
            available,
            session,
          };
        }),
      );

      const unavailableSeats = availabilityChecks.filter(
        (item) => !item.available,
      );

      if (unavailableSeats.length > 0) {
        const seatsList = unavailableSeats
          .map((item) => `ряд ${item.row}, место ${item.seat}`)
          .join('; ');

        throw new ConflictException(`Следующие места уже заняты: ${seatsList}`);
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

      const reservationPromises = [];

      for (const [key, seats] of sessionsMap) {
        const [filmId, sessionId] = key.split(':');

        reservationPromises.push(
          this.filmsRepository
            .reserveSeats(filmId, sessionId, seats)
            .catch((error) => {
              this.logger.error(
                `Ошибка резервирования мест для сеанса ${sessionId}: ${error.message}`,
              );
              throw new ConflictException(
                `Не удалось забронировать места для сеанса ${sessionId}. Возможно, они были заняты в процессе оформления.`,
              );
            }),
        );
      }

      await Promise.all(reservationPromises);

      const responseItems: ConfirmedOrder[] = orderItems.map((item) => {
        const orderId = uuidv4();
        return this.toResponseDto(item, orderId);
      });

      const response: CreateOrderResponseDto = {
        total: responseItems.length,
        items: responseItems,
      };

      this.logger.log(`Заказ успешно создан. Всего билетов: ${response.total}`);

      return response;
    } catch (error) {
      this.logger.error(
        `Ошибка при создании заказа: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
