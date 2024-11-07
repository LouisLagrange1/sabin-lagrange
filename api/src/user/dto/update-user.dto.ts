import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  IsPositive,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

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
}
