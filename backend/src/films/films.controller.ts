import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { HybridLogger } from 'src/logger/hybridLogger/hybridLogger.service';

@Controller('api/afisha/films')
export class FilmsController {
  constructor(
    private readonly filmsService: FilmsService,
    private readonly logger: HybridLogger,
  ) {}

  @Get()
  findAll() {
    this.logger.log('Get all films');
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findOneSchedule(@Param('id') id: string) {
    this.logger.log(`Get film schedule by id: ${id}`);
    return this.filmsService.findSchedule(id);
  }
}
