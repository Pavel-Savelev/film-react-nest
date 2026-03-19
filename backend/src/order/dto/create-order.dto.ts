// import { IsNumber, IsUUID, IsArray, IsString } from 'class-validator';

// export class CreateOrderItemDto {
//   @IsUUID()
//   film: string;

//   @IsUUID()
//   session: string;

//   @IsString()
//   daytime: string;
//   @IsNumber()
//   row: number;

//   @IsNumber()
//   seat: number;

//   @IsNumber()
//   price: number;
// }
// я
// export class ConfirmedOrder extends CreateOrderItemDto {
//   @IsUUID()
//   id: string;
// }

// export class CreateOrderResponseDto {
//   @IsNumber()
//   total: number;

//   @IsArray()
//   items: ConfirmedOrder[];
// }

import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class OrderTicketDto {
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

export class CreateOrderDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderTicketDto)
  tickets: OrderTicketDto[];
}

export class ConfirmedOrderDto extends OrderTicketDto {
  @IsUUID()
  id: string;
}

export class CreateOrderResponseDto {
  @IsNumber()
  total: number;

  @IsArray()
  items: ConfirmedOrderDto[];
}
