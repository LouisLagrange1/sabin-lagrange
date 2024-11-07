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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Participation } from 'src/participation/entities/participation.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Créer un nouvel utilisateur
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  // Récupérer tous les utilisateurs avec pagination
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<User[]> {
    return this.userService.findAll(page, limit);
  }

  // Récupérer un utilisateur par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  // Mettre à jour un utilisateur
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, updateUserDto);
  }

  // Supprimer un utilisateur
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  // Ajouter des jeux proposés à un utilisateur
  @Post(':id/games')
  async addGamesToUser(
    @Param('id') id: number,
    @Body('gameIds') gameIds: number[], // Attendre un tableau d'ID de jeux
  ): Promise<User> {
    return this.userService.addGamesToUser(id, gameIds);
  }

  // Ajouter une participation à un utilisateur
  @Post(':id/participations')
  async addParticipationToUser(
    @Param('id') id: number,
    @Body()
    {
      eventId,
      status,
      comment,
      rating,
    }: { eventId: number; status: string; comment: string; rating: number },
  ): Promise<Participation> {
    return this.userService.addParticipationToUser(
      id,
      eventId,
      status,
      comment,
      rating,
    );
  }
}
