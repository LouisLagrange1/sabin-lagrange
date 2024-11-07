import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @IsOptional()
  content?: string; // Le contenu du message est optionnel lors de la mise à jour

  @IsDateString()
  @IsOptional()
  message_date?: Date; // La date du message est optionnelle

  @IsOptional()
  senderId?: number; // L'ID de l'utilisateur est optionnel
}
