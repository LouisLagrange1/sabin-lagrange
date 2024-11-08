import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from './entities/invite.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  async create(createInviteDto: CreateInviteDto): Promise<Invite> {
    const { userId, eventId, comment, rating } = createInviteDto;

    // Vérifier si l'utilisateur et l'événement existent
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

    // Créer l'invitation
    const invite = this.inviteRepository.create({
      comment,
      rating,
      user,
      event,
    });

    return this.inviteRepository.save(invite);
  }
  // Trouver toutes les invitations avec filtrage et pagination
  async findAll(
    page: number = 1,
    limit: number = 10,
    userId?: number,
    eventId?: number,
  ): Promise<Invite[]> {
    const cacheKey = `invites_page_${page}_limit_${limit}_user_${userId}_event_${eventId}`;
    const cachedData = await this.cacheManager.get<Invite[]>(cacheKey);

    // Si des données sont en cache, retourner directement
    if (cachedData) {
      return cachedData;
    }

    const query = this.inviteRepository.createQueryBuilder('invite');

    // Pagination
    query.skip((page - 1) * limit).take(limit);

    // Filtrage par userId
    if (userId) {
      query.andWhere('invite.userId = :userId', { userId });
    }

    // Filtrage par eventId
    if (eventId) {
      query.andWhere('invite.eventId = :eventId', { eventId });
    }

    // Exécuter la requête
    const invites = await query.getMany();

    // Mise en cache pour 5 minutes
    await this.cacheManager.set(cacheKey, invites, 300);

    return invites;
  }

  // Trouver une invitation par ID
  async findOne(id: number): Promise<Invite> {
    const invite = await this.inviteRepository.findOne({
      where: { id },
      relations: ['user', 'event'], // Charger les relations utilisateur et événement
    });

    if (!invite) {
      throw new NotFoundException(`Invite with ID ${id} not found`);
    }

    return invite;
  }

  // Mettre à jour une invitation existante
  async update(id: number, updateInviteDto: UpdateInviteDto): Promise<Invite> {
    const invite = await this.findOne(id); // Vérifie si l'invitation existe

    // Mettre à jour les propriétés de l'invitation
    const updatedInvite = Object.assign(invite, updateInviteDto);
    await this.inviteRepository.save(updatedInvite);

    // Rafraîchir le cache
    await this.cacheManager.del(`invites_page_*`);

    return updatedInvite;
  }

  // Supprimer une invitation
  async remove(id: number): Promise<void> {
    const invite = await this.findOne(id);
    await this.inviteRepository.remove(invite);

    // Supprimer le cache
    await this.cacheManager.del(`invites_page_*`);
  }
}
