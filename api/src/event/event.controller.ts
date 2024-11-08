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
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';

@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(createEventDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('event_name') event_name?: string,
    @Query('date') date?: Date,
    @Query('location_id') locationId?: number,
    @Query('type_id') typeId?: number,
  ): Promise<Event[]> {
    return this.eventService.findAll(
      page,
      limit,
      event_name,
      date,
      locationId,
      typeId,
    );
  }

  // Trouver un événement par ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Event> {
    return this.eventService.findOne(id);
  }

  // Mettre à jour un événement
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.update(id, updateEventDto);
  }

  // Supprimer un événement
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.eventService.remove(id);
  }
}
