import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  // Créer un nouveau jeu
  @Post()
  async create(@Body() createGameDto: CreateGameDto): Promise<Game> {
    return this.gameService.create(createGameDto);
  }

  // Récupérer tous les jeux avec pagination et filtrage
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('gameName') gameName?: string,
    @Query('gameType') gameType?: string,
    @Query('userId') userId?: number,
  ): Promise<Game[]> {
    return this.gameService.findAll(page, limit, gameName, gameType, userId);
  }

  // Récupérer un jeu par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Game> {
    return this.gameService.findOne(id);
  }

  // Mettre à jour un jeu
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateGameDto: UpdateGameDto,
  ): Promise<Game> {
    return this.gameService.update(id, updateGameDto);
  }

  // Supprimer un jeu
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.gameService.remove(id);
  }

  // Ajouter des utilisateurs à un jeu
  @Post(':id/users')
  async addUsersToGame(
    @Param('id') id: number,
    @Body('userIds') userIds: number[], // Attendre un tableau d'ID d'utilisateurs
  ): Promise<Game> {
    return this.gameService.addUsersToGame(id, userIds);
  }
}
