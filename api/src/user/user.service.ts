import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Location } from '../location/entities/location.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Location)
    private locationRepository: Repository<Location>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Créer un utilisateur
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérification de l'existence de la location
    const location = await this.locationRepository.findOne({
      where: { id: createUserDto.locationId },
    });
    if (!location) {
      throw new NotFoundException(
        `Location with ID ${createUserDto.locationId} not found`,
      );
    }

    // Création de l'utilisateur avec la localisation associée
    const user = this.userRepository.create({
      ...createUserDto,
      location,
    });

    // Sauvegarde de l'utilisateur
    return this.userRepository.save(user);
  }

  // Trouver tous les utilisateurs avec filtrage et pagination
  async findAll(
    page: number = 1,
    limit: number = 10,
    email?: string,
    locationId?: number,
  ): Promise<User[]> {
    const cacheKey = `users_page_${page}_limit_${limit}_email_${email}_location_${locationId}`;
    const cachedData = await this.cacheManager.get<User[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query = this.userRepository.createQueryBuilder('user');
    query.skip((page - 1) * limit).take(limit);

    // Filtrage par email
    if (email) {
      query.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    // Filtrage par location
    if (locationId) {
      query.andWhere('user.locationId = :locationId', { locationId });
    }

    const users = await query.getMany();
    await this.cacheManager.set(cacheKey, users, 300); // Mise en cache pour 5 minutes

    return users;
  }

  // Trouver un utilisateur par ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['location'], // Charger la relation location
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Mettre à jour un utilisateur
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    // Vérifier que l'utilisateur existe
    const existingUser = await this.findOne(id);

    // Si une nouvelle location est fournie, l'associer à l'utilisateur
    if (updateUserDto.locationId) {
      const location = await this.locationRepository.findOne({
        where: { id: updateUserDto.locationId },
      });

      if (!location) {
        throw new NotFoundException(
          `Location with ID ${updateUserDto.locationId} not found`,
        );
      }

      existingUser.location = location;
    }

    // Mettre à jour l'utilisateur avec les nouvelles données
    await this.userRepository.update(id, updateUserDto);

    // Rafraîchir les relations
    const updatedUser = await this.findOne(id);

    // Invalidation du cache
    await this.cacheManager.del(`users_page_*`);

    return updatedUser;
  }

  // Supprimer un utilisateur
  async remove(id: number): Promise<void> {
    // Vérifier que l'utilisateur existe
    const user = await this.findOne(id);

    // Supprimer l'utilisateur
    await this.userRepository.remove(user);

    // Supprimer du cache
    await this.cacheManager.del(`users_page_*`);
  }
}
