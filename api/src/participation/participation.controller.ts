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
import { ParticipationService } from './participation.service';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { Participation } from './entities/participation.entity';

@Controller('participations')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  // Créer une nouvelle participation
  @Post()
  async create(
    @Body() createParticipationDto: CreateParticipationDto,
  ): Promise<Participation> {
    return this.participationService.create(createParticipationDto);
  }

  // Récupérer toutes les participations avec pagination et filtrage
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('status') status?: string,
    @Query('userId') userId?: number,
    @Query('eventId') eventId?: number,
  ): Promise<Participation[]> {
    return this.participationService.findAll(
      page,
      limit,
      status,
      userId,
      eventId,
    );
  }

  // Récupérer une participation par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Participation> {
    return this.participationService.findOne(id);
  }

  // Mettre à jour une participation
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateParticipationDto: UpdateParticipationDto,
  ): Promise<Participation> {
    return this.participationService.update(id, updateParticipationDto);
  }

  // Supprimer une participation
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.participationService.remove(id);
  }
}
