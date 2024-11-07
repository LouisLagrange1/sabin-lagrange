import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Game } from 'src/game/entities/game.entity';
import { Participation } from 'src/participation/entities/participation.entity';
import { Message } from 'src/message/entities/message.entity';
import { Invite } from 'src/invite/entities/invite.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @InjectRepository(Game)
    private gameRepository: Repository<Game>,

    @InjectRepository(Participation)
    private participationRepository: Repository<Participation>,

    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(Invite)
    private inviteRepository: Repository<Invite>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Créer un nouvel utilisateur
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  // Trouver tous les utilisateurs avec pagination
  async findAll(page: number = 1, limit: number = 10): Promise<User[]> {
    const cacheKey = `users_page_${page}_limit_${limit}`;
    const cachedData = await this.cacheManager.get<User[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const users = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: [
        'location',
        'eventsCreated',
        'gamesProposed',
        'participations',
        'messages',
        'invites',
      ],
    });

    await this.cacheManager.set(cacheKey, users, 300);

    return users;
  }

  // Trouver un utilisateur par son ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'location',
        'eventsCreated',
        'gamesProposed',
        'participations',
        'messages',
        'invites',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Mettre à jour un utilisateur
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.findOne(id);

    // Rafraîchir le cache
    await this.cacheManager.del(`users_page_*`);

    return updatedUser;
  }

  // Supprimer un utilisateur
  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);

    // Supprimer le cache
    await this.cacheManager.del(`users_page_*`);
  }

  // Ajouter des jeux proposés à un utilisateur
  async addGamesToUser(userId: number, gameIds: number[]): Promise<User> {
    const user = await this.findOne(userId);
    const games = await this.gameRepository.findByIds(gameIds);
    user.gamesProposed = games;
    return this.userRepository.save(user);
  }

  // Ajouter une participation à un utilisateur
  async addParticipationToUser(
    userId: number,
    eventId: number,
    status: string,
    comment: string,
    rating: number,
  ): Promise<Participation> {
    // Trouver l'utilisateur par son ID
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Trouver l'événement par son ID
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException(`Event with ID ${eventId} not found`);
    }

    // Créer la participation
    const participation = this.participationRepository.create({
      status,
      comment,
      rating,
      user,
      event,
    });

    // Sauvegarder la participation dans la base de données
    return this.participationRepository.save(participation);
  }
}
