import { IsOptional, IsString } from 'class-validator';

export class CreateGameDto {
  @IsOptional()
  @IsString()
  readonly game_name: string;

  @IsOptional()
  @IsString()
  readonly game_type: string;
}
