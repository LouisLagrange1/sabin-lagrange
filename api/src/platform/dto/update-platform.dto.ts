import { IsString, IsOptional } from 'class-validator';

export class UpdatePlatformDto {
  @IsString()
  @IsOptional()
  platform_name?: string;
}
