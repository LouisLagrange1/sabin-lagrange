import {
  IsString,
  IsDate,
  IsBoolean,
  IsNumber,
  IsArray,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @MaxLength(100)
  @IsOptional()
  event_name?: string;

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsString()
  @MaxLength(5)
  @IsOptional()
  time?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  number_of_places?: number;

  @IsBoolean()
  @IsOptional()
  is_paid?: boolean;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  locationId?: number;

  @IsNumber()
  @IsOptional()
  creatorId?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  platformIds?: number[];

  @IsNumber()
  @IsOptional()
  typeId?: number;
}
