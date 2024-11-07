import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePlatformDto {
  @IsString()
  @IsNotEmpty()
  platform_name: string;
}
