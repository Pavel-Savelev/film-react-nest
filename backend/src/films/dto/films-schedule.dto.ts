import { IsNumber, IsString, IsArray, IsUUID } from 'class-validator';

export class SessionDto {
  @IsUUID()
  id: string;

  @IsString()
  daytime: string;

  @IsString()
  hall: string;

  @IsNumber()
  rows: number;

  @IsNumber()
  seats: number;

  @IsNumber()
  price: number;

  @IsArray()
  taken: string[];
}

export class ScheduleResponseDto {
  @IsNumber()
  total: number;

  @IsArray()
  items: SessionDto[];
}
