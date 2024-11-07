import { IsString, IsOptional } from 'class-validator';

export class UpdateTypeEventDto {
  @IsString()
  @IsOptional()
  label?: string;
}
