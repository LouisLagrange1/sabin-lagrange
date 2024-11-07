import {
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class CreateParticipationDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsInt()
  eventId: number;

  @IsInt()
  userId: number;
}
