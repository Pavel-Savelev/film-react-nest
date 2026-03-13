import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { HybridLogger } from 'src/logger/hybridLogger/hybridLogger.service';

describe('OrderController', () => {
  let controller: OrderController;

  const mockOrderService = {
    createOrders: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
        { provide: HybridLogger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call logger and service on create', async () => {
    const orderItems = [
      {
        film: '1',
        session: 'a',
        row: 1,
        seat: 1,
        price: 100,
        daytime: new Date().toISOString(),
      },
    ];
    mockOrderService.createOrders.mockResolvedValue({
      total: 1,
      items: orderItems,
    });

    const result = await controller.create(orderItems);

    expect(mockLogger.log).toHaveBeenCalledWith('Create request');
    expect(mockOrderService.createOrders).toHaveBeenCalledWith(orderItems);
    expect(result).toEqual({ total: 1, items: orderItems });
  });
});
