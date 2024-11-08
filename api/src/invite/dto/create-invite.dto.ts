import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInviteDto {
  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  eventId: number;
}
