import { IsString, IsInt, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  message_date: Date;

  @IsInt()
  senderId: number; // ID de l'utilisateur qui envoie le message
}
