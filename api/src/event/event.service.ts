/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Location } from 'src/location/entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import { Platform } from 'src/platform/entities/platform.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TypeEvent } from 'src/type_event/entities/type_event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Créer un nouvel événement
  async create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  // Trouver tous les événements avec filtrage et pagination
  async findAll(
    page: number = 1,
    limit: number = 10,
    eventName?: string,
    date?: Date,
    locationId?: number,
    typeId?: number,
  ): Promise<Event[]> {
    const cacheKey = `events_page_${page}_limit_${limit}_name_${eventName}_date_${date}_location_${locationId}_type_${typeId}`;
    const cachedData = await this.cacheManager.get<Event[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query = this.eventRepository.createQueryBuilder('event');

    query.skip((page - 1) * limit).take(limit);

    // Filtrage par nom d'événement
    if (eventName) {
      query.andWhere('event.event_name LIKE :eventName', {
        eventName: `%${eventName}%`,
      });
    }

    // Filtrage par date
    if (date) {
      query.andWhere('event.date = :date', { date });
    }

    // Filtrage par location
    if (locationId) {
      query.andWhere('event.locationId = :locationId', { locationId });
    }

    // Filtrage par type d'événement
    if (typeId) {
      query.andWhere('event.typeId = :typeId', { typeId });
    }

    const events = await query.getMany();
    await this.cacheManager.set(cacheKey, events, 300); // Mise en cache des événements pour 5 minutes

    return events;
  }

  // Trouver un événement par ID
  async findOne(id: number): Promise<Event> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['location', 'creator', 'platforms', 'type'], // Charger les relations nécessaires
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  // Mettre à jour un événement existant
  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    await this.eventRepository.update(id, updateEventDto);

    const updatedEvent = await this.findOne(id);

    // Rafraîchir le cache
    await this.cacheManager.del(`events_page_*`);

    return updatedEvent;
  }

  // Supprimer un événement
  async remove(id: number): Promise<void> {
    const event = await this.findOne(id);

    await this.eventRepository.remove(event);

    // Supprimer le cache
    await this.cacheManager.del(`events_page_*`);
  }
}
