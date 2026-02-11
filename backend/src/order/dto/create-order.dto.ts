import { IsNumber, IsUUID, IsArray, IsString } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  film: string;

  @IsUUID()
  session: string;

  @IsString()
  daytime: string;
  @IsNumber()
  row: number;

  @IsNumber()
  seat: number;

  @IsNumber()
  price: number;
}

export class ConfirmedOrder extends CreateOrderItemDto {
  @IsUUID()
  id: string;
}

export class CreateOrderResponseDto {
  @IsNumber()
  total: number;

  @IsArray()
  items: ConfirmedOrder[];
}
