import { IsString, IsOptional, IsNumber, IsInt } from 'class-validator';

export class UpdateParticipationDto {
  @IsString()
  @IsOptional()
  status?: string;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsOptional()
  @IsInt()
  eventId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;
}
