import { Controller, Get, Param } from '@nestjs/common';

import { FilmsService } from './films.service';

@Controller('api/afisha/films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findOneSchedule(@Param('id') id: string) {
    return this.filmsService.findSchedule(id);
  }
}
