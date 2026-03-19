import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { FilmsRepository } from '../repositories/film.repository';
import { HybridLogger } from '../logger/hybridLogger/hybridLogger.service';

describe('FilmsService', () => {
  let service: FilmsService;

  const mockFilmsRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        { provide: FilmsRepository, useValue: mockFilmsRepository },
        { provide: HybridLogger, useValue: mockLogger }, // <-- добавляем сюда
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
