import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { UpdateParticipationDto } from './dto/update-participation.dto';
import { Participation } from './entities/participation.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Créer une nouvelle participation
  async create(
    createParticipationDto: CreateParticipationDto,
  ): Promise<Participation> {
    const { userId, eventId, status, comment, rating } = createParticipationDto;

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    const participation = this.participationRepository.create({
      status,
      comment,
      rating,
      user,
      event,
    });

    return this.participationRepository.save(participation);
  }

  // Trouver toutes les participations avec pagination et filtrage
  async findAll(
    page: number = 1,
    limit: number = 10,
    status?: string,
    userId?: number,
    eventId?: number,
  ): Promise<Participation[]> {
    const cacheKey = `participations_page_${page}_limit_${limit}_status_${status}_user_${userId}_event_${eventId}`;
    const cachedData = await this.cacheManager.get<Participation[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query =
      this.participationRepository.createQueryBuilder('participation');
    query.skip((page - 1) * limit).take(limit);

    // Filtrage par statut de participation
    if (status) {
      query.andWhere('participation.status LIKE :status', {
        status: `%${status}%`,
      });
    }

    // Filtrage par utilisateur
    if (userId) {
      query.andWhere('participation.userId = :userId', { userId });
    }

    // Filtrage par événement
    if (eventId) {
      query.andWhere('participation.eventId = :eventId', { eventId });
    }

    const participations = await query.getMany();
    await this.cacheManager.set(cacheKey, participations, 300);

    return participations;
  }

  // Trouver une participation par ID
  async findOne(id: number): Promise<Participation> {
    const participation = await this.participationRepository.findOne({
      where: { id },
      relations: ['user', 'event'],
    });

    if (!participation) {
      throw new NotFoundException(`Participation with ID ${id} not found`);
    }

    return participation;
  }

  // Mettre à jour une participation
  async update(
    id: number,
    updateParticipationDto: UpdateParticipationDto,
  ): Promise<Participation> {
    await this.participationRepository.update(id, updateParticipationDto);
    const updatedParticipation = await this.findOne(id);

    // Rafraîchir le cache
    await this.cacheManager.del(`participations_page_*`);

    return updatedParticipation;
  }

  // Supprimer une participation
  async remove(id: number): Promise<void> {
    const participation = await this.findOne(id);
    await this.participationRepository.remove(participation);

    // Supprimer le cache
    await this.cacheManager.del(`participations_page_*`);
  }
}
