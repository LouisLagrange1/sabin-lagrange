import {
  IsString,
  IsDate,
  IsBoolean,
  IsNumber,
  IsArray,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MaxLength(100)
  event_name: string;

  @IsDate()
  date: Date;

  @IsString()
  @MaxLength(5)
  time: string;

  @IsNumber()
  @Min(1)
  number_of_places: number;

  @IsBoolean()
  is_paid: boolean;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  locationId: number;

  @IsNumber()
  creatorId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  platformIds: number[];

  @IsNumber()
  typeId: number;
}
