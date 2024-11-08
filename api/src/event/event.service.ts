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

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(TypeEvent)
    private typeEventRepository: Repository<TypeEvent>,

    @InjectRepository(Platform)
    private platformRepository: Repository<Platform>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Créer un événement
  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Vérification de l'existence du TypeEvent
    const typeEvent = await this.typeEventRepository.findOne({
      where: { id: createEventDto.typeId },
    });
    if (!typeEvent) {
      throw new NotFoundException(
        `TypeEvent with ID ${createEventDto.typeId} not found`,
      );
    }

    // Récupération de la Location et du Creator
    const location = await this.locationRepository.findOne({
      where: { id: createEventDto.locationId }, // Modification ici
    });
    const creator = await this.userRepository.findOne({
      where: { id: createEventDto.creatorId }, // Modification ici
    });

    if (!location) {
      throw new NotFoundException(
        `Location with ID ${createEventDto.locationId} not found`,
      );
    }
    if (!creator) {
      throw new NotFoundException(
        `Creator with ID ${createEventDto.creatorId} not found`,
      );
    }

    // Récupération des plateformes
    const platforms = await this.platformRepository.findByIds(
      createEventDto.platformIds,
    );

    // Création de l'événement avec toutes les relations correctement assignées
    const event = this.eventRepository.create({
      ...createEventDto,
      location,
      creator,
      platforms,
      type: typeEvent, // Association du type d'événement
    });

    // Sauvegarde de l'événement
    return this.eventRepository.save(event);
  }

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

    // Pagination
    query.skip((page - 1) * limit).take(limit);

    // Jointures pour inclure location, user (organisateur), et type d'événement
    query
      .leftJoinAndSelect('event.location', 'location') // Jointure avec Location
      .leftJoinAndSelect('event.creator', 'creator') // Jointure avec User (organisateur)
      .leftJoinAndSelect('event.type', 'type'); // Jointure avec Type d'événement

    // Filtrage par nom d'événement (si précisé)
    if (eventName) {
      query.andWhere('event.event_name LIKE :eventName', {
        eventName: `%${eventName}%`,
      });
    }

    // Filtrage par date (si précisée)
    if (date) {
      query.andWhere('event.date = :date', { date });
    }

    // Filtrage par locationId (si précisé)
    if (locationId) {
      query.andWhere('event.locationId = :locationId', { locationId });
    }

    // Filtrage par typeId (si précisé)
    if (typeId) {
      query.andWhere('event.typeId = :typeId', { typeId });
    }

    // Exécution de la requête avec toutes les relations nécessaires (jointures)
    const events = await query.getMany();

    // Mise en cache des événements récupérés
    await this.cacheManager.set(cacheKey, events, 300); // Mise en cache pour 5 minutes

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
    // Vérifier que l'événement existe
    const existingEvent = await this.findOne(id);

    // Mettre à jour l'événement
    await this.eventRepository.update(id, updateEventDto);

    // Rafraîchir les relations
    const updatedEvent = await this.findOne(id);

    // Invalidation du cache
    await this.cacheManager.del(`events_page_*`);

    return updatedEvent;
  }

  // Supprimer un événement
  async remove(id: number): Promise<void> {
    // Vérifier que l'événement existe
    const event = await this.findOne(id);

    // Supprimer l'événement
    await this.eventRepository.remove(event);

    // Supprimer du cache
    await this.cacheManager.del(`events_page_*`);
  }
}
