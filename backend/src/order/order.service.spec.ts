import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';
import { OrderRepository } from './repositories/order.repository';
import { FilmsRepository } from '../films/repositories/film.repository';

describe('OrderService', () => {
  let service: OrderService;

  // Mock для репозиториев
  const mockOrderRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockFilmsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: OrderRepository, useValue: mockOrderRepository },
        { provide: FilmsRepository, useValue: mockFilmsRepository },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
