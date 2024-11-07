import { IsString, IsDate, IsBoolean, IsNumber } from 'class-validator';

export class CreateEventDto {
  @IsString()
  event_name: string;

  @IsDate()
  date: Date;

  @IsString()
  time: string;

  @IsNumber()
  number_of_places: number;

  @IsBoolean()
  is_paid: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @IsNumber()
  locationId: number;

  @IsNumber()
  creatorId: number;

  @IsNumber({}, { each: true })
  platformIds: number[];

  @IsNumber()
  typeId: number;
}
