import { Controller, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { HybridLogger } from '../logger/hybridLogger/hybridLogger.service';

@Controller('api/afisha/order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly logger: HybridLogger,
  ) {}

  @Post()
  async create(@Body() order: CreateOrderDto) {
    this.logger.log('Create request');
    return this.orderService.createOrders(order.tickets);
  }
}
