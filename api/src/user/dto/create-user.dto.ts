import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsInt,
  IsPositive,
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
}
