import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { HybridLogger } from 'src/logger/hybridLogger/hybridLogger.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let logger: HybridLogger;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: FilmsService;

  const mockFilmsService = {
    findAll: jest.fn(),
    findSchedule: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
        {
          provide: HybridLogger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    logger = module.get<HybridLogger>(HybridLogger);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call logger and service on findAll', async () => {
    mockFilmsService.findAll.mockResolvedValue([{ id: '1', title: 'Film1' }]);

    const result = await controller.findAll();

    expect(logger.log).toHaveBeenCalledWith('Get all films');
    expect(mockFilmsService.findAll).toHaveBeenCalled();
    expect(result).toEqual([{ id: '1', title: 'Film1' }]);
  });

  it('should call logger and service on findOneSchedule', async () => {
    const filmId = '123';
    mockFilmsService.findSchedule.mockResolvedValue({ total: 0, items: [] });

    const result = await controller.findOneSchedule(filmId);

    expect(logger.log).toHaveBeenCalledWith(
      `Get film schedule by id: ${filmId}`,
    );
    expect(mockFilmsService.findSchedule).toHaveBeenCalledWith(filmId);
    expect(result).toEqual({ total: 0, items: [] });
  });
});
