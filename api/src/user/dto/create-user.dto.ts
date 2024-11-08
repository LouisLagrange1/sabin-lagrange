// src/user/dto/create-user.dto.ts
import {
  IsEmail,
  IsString,
  IsInt,
  IsPositive,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  @IsPositive()
  age: number;

  @IsString()
  @IsNotEmpty()
  interests: string;

  @IsInt()
  @IsPositive()
  profile_rating: number;

  @IsInt()
  @IsPositive()
  locationId: number; // Pour lier à une location
}
