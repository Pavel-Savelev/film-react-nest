import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';

//TODO описать DTO для запросов к /films
export class GetFilmDto {
  @IsUUID()
  id: string;

  @IsNumber()
  rating: number;

  @IsString()
  director: string;

  @IsArray()
  tags: string[];

  @IsString()
  title: string;

  @IsString()
  about: string;

  @IsString()
  description: string;

  @IsString()
  image: string;

  @IsString()
  cover: string;
}

export class GetResponsFilmsDto {
  @IsNumber()
  total: number;

  @IsArray()
  items: GetFilmDto[];
}
