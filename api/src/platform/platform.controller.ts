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
import { PlatformService } from './platform.service';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { Platform } from './entities/platform.entity';

@Controller('platforms')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  // Créer une nouvelle plateforme
  @Post()
  async create(
    @Body() createPlatformDto: CreatePlatformDto,
  ): Promise<Platform> {
    return this.platformService.create(createPlatformDto);
  }

  // Récupérer toutes les plateformes avec pagination et filtrage
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('platformName') platformName?: string,
  ): Promise<Platform[]> {
    return this.platformService.findAll(page, limit, platformName);
  }

  // Récupérer une plateforme par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Platform> {
    return this.platformService.findOne(id);
  }

  // Mettre à jour une plateforme
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    return this.platformService.update(id, updatePlatformDto);
  }

  // Supprimer une plateforme
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.platformService.remove(id);
  }

  // Ajouter des événements à une plateforme
  @Post(':id/events')
  async addEventsToPlatform(
    @Param('id') id: number,
    @Body('eventIds') eventIds: number[], // Attendre un tableau d'ID d'événements
  ): Promise<Platform> {
    return this.platformService.addEventsToPlatform(id, eventIds);
  }
}
