import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderItemDto } from './dto/create-order.dto';
import { HybridLogger } from 'src/logger/hybridLogger/hybridLogger.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly logger: HybridLogger,
  ) {}

  @Post()
  async create(@Body() orderItems: CreateOrderItemDto[]) {
    this.logger.log('Create request');
    return this.orderService.createOrders(orderItems);
  }
}
