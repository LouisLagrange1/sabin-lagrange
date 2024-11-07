import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateTypeEventDto } from './dto/create-type_event.dto';
import { UpdateTypeEventDto } from './dto/update-type_event.dto';
import { TypeEvent } from './entities/type_event.entity';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class TypeEventService {
  constructor(
    @InjectRepository(TypeEvent)
    private typeEventRepository: Repository<TypeEvent>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Créer un nouveau type d'événement
  async create(createTypeEventDto: CreateTypeEventDto): Promise<TypeEvent> {
    const { label } = createTypeEventDto;

    const typeEvent = this.typeEventRepository.create({
      label,
    });

    return this.typeEventRepository.save(typeEvent);
  }

  // Trouver tous les types d'événements avec pagination
  async findAll(
    page: number = 1,
    limit: number = 10,
    label?: string,
  ): Promise<TypeEvent[]> {
    const cacheKey = `type_events_page_${page}_limit_${limit}_label_${label}`;
    const cachedData = await this.cacheManager.get<TypeEvent[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query = this.typeEventRepository.createQueryBuilder('type_event');
    query.skip((page - 1) * limit).take(limit);

    // Filtrage par label de type d'événement
    if (label) {
      query.andWhere('type_event.label LIKE :label', {
        label: `%${label}%`,
      });
    }

    const typeEvents = await query.getMany();
    await this.cacheManager.set(cacheKey, typeEvents, 300);

    return typeEvents;
  }

  // Trouver un type d'événement par ID
  async findOne(id: number): Promise<TypeEvent> {
    const typeEvent = await this.typeEventRepository.findOne({
      where: { id },
      relations: ['events'], // Charger les événements associés à ce type d'événement
    });

    if (!typeEvent) {
      throw new NotFoundException(`TypeEvent with ID ${id} not found`);
    }

    return typeEvent;
  }

  // Mettre à jour un type d'événement
  async update(
    id: number,
    updateTypeEventDto: UpdateTypeEventDto,
  ): Promise<TypeEvent> {
    await this.typeEventRepository.update(id, updateTypeEventDto);
    const updatedTypeEvent = await this.findOne(id);

    // Rafraîchir le cache
    await this.cacheManager.del(`type_events_page_*`);

    return updatedTypeEvent;
  }

  // Supprimer un type d'événement
  async remove(id: number): Promise<void> {
    const typeEvent = await this.findOne(id);
    await this.typeEventRepository.remove(typeEvent);

    // Supprimer le cache
    await this.cacheManager.del(`type_events_page_*`);
  }

  // Ajouter des événements à un type d'événement
  async addEventsToTypeEvent(
    typeEventId: number,
    eventIds: number[],
  ): Promise<TypeEvent> {
    const typeEvent = await this.findOne(typeEventId);
    const events = await this.eventRepository.findByIds(eventIds);
    typeEvent.events = events;
    return this.typeEventRepository.save(typeEvent);
  }
}
