import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from '../repositories/order.repository';
import { FilmsRepository } from '../repositories/film.repository';
import { HybridLogger } from '../logger/hybridLogger/hybridLogger.service';

describe('OrderService', () => {
  let service: OrderService;

  const mockOrderRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockFilmsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  const mockHybridLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: mockOrderRepository },
        { provide: FilmsRepository, useValue: mockFilmsRepository },
        { provide: HybridLogger, useValue: mockHybridLogger },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
