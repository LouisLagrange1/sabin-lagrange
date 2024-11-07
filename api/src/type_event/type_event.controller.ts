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
import { TypeEventService } from './type_event.service';
import { CreateTypeEventDto } from './dto/create-type_event.dto';
import { UpdateTypeEventDto } from './dto/update-type_event.dto';
import { TypeEvent } from './entities/type_event.entity';

@Controller('type-events')
export class TypeEventController {
  constructor(private readonly typeEventService: TypeEventService) {}

  // Créer un nouveau type d'événement
  @Post()
  async create(
    @Body() createTypeEventDto: CreateTypeEventDto,
  ): Promise<TypeEvent> {
    return this.typeEventService.create(createTypeEventDto);
  }

  // Récupérer tous les types d'événements avec pagination et filtrage
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('label') label?: string,
  ): Promise<TypeEvent[]> {
    return this.typeEventService.findAll(page, limit, label);
  }

  // Récupérer un type d'événement par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TypeEvent> {
    return this.typeEventService.findOne(id);
  }

  // Mettre à jour un type d'événement
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateTypeEventDto: UpdateTypeEventDto,
  ): Promise<TypeEvent> {
    return this.typeEventService.update(id, updateTypeEventDto);
  }

  // Supprimer un type d'événement
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.typeEventService.remove(id);
  }

  // Ajouter des événements à un type d'événement
  @Post(':id/events')
  async addEventsToTypeEvent(
    @Param('id') id: number,
    @Body('eventIds') eventIds: number[], // Attendre un tableau d'ID d'événements
  ): Promise<TypeEvent> {
    return this.typeEventService.addEventsToTypeEvent(id, eventIds);
  }
}
