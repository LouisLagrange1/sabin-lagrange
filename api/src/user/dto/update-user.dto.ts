// src/user/dto/update-user.dto.ts
import {
  IsEmail,
  IsString,
  IsInt,
  IsPositive,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  interests?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  profile_rating?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  locationId?: number; // Pour mettre à jour la localisation
}
