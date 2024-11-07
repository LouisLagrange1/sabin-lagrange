import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateInviteDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  comment: string;

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsNumber()
  userId: number; // ID de l'utilisateur qui est l'invité

  @IsNumber()
  eventId: number; // ID de l'événement auquel l'invitation appartient
}
