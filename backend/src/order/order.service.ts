import {
  BadRequestException,
  Injectable,
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
import { HybridLogger } from 'src/logger/hybridLogger/hybridLogger.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly filmsRepository: FilmsRepository,
    private readonly logger: HybridLogger,
  ) {
    this.logger.log('OrderService initialized');
  }

  private async validateSeatAvailability(
    filmId: string,
    sessionId: string,
    seat: number,
    row: number,
  ): Promise<{ available: boolean; session?: any }> {
    const film = await this.filmsRepository.findByFilmId(filmId);

    if (!film) {
      this.logger.warn(`Film ${filmId} not found`);
      throw new NotFoundException(`Фильм с ID ${filmId} не найден`);
    }

    const session = film.schedules?.find((s) => s.id === sessionId);

    if (!session) {
      this.logger.warn(`Film ${filmId} has no sessions`);
      throw new NotFoundException(`Сеанс с ID ${sessionId} не найден`);
    }

    if (row < 1 || row > session.rows) {
      this.logger.warn('Bad request position');
      throw new BadRequestException(
        `Некорректный ряд: ${row}. Допустимые ряды: 1-${session.rows}`,
      );
    }

    if (seat < 1 || seat > session.seats) {
      this.logger.warn('Bad request position');
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
    this.logger.log(`Order length: ${orderItems.length}`);
    if (!orderItems || orderItems.length === 0) {
      this.logger.warn('Order cannot be empty');
      throw new BadRequestException('Заказ не может быть пустым');
    }

    const seatKeys = new Set<string>();
    for (const item of orderItems) {
      const key = `${item.film}:${item.session}:${item.row}:${item.seat}`;

      if (seatKeys.has(key)) {
        this.logger.warn('Find same postitions on one Film');
        throw new BadRequestException(
          `Обнаружен дубликат места: фильм ${item.film}, сеанс ${item.session}, ряд ${item.row}, место ${item.seat}`,
        );
      }
      seatKeys.add(key);
    }

    for (const item of orderItems) {
      if (item.price <= 0) {
        this.logger.warn(`Bad price count: ${item.price}`);
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
      this.logger.log(
        `Create order. Order ticket length: ${orderItems.length}`,
      );

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
                `Error order postions by session ${sessionId}: ${error.message}`,
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

      this.logger.log(`Order success total tickets: ${response.total}`);

      return response;
    } catch (error) {
      this.logger.error(`Error create order : ${error.message}`, error.stack);
      throw error;
    }
  }
}
