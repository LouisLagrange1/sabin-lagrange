import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Créer une nouvelle location
  async create(createLocationDto: CreateLocationDto): Promise<Location> {
    const { address, city, region } = createLocationDto;

    // Créer la location
    const location = this.locationRepository.create({
      address,
      city,
      region,
    });
    return this.locationRepository.save(location);
  }

  // Trouver toutes les locations avec pagination et cache
  async findAll(
    page: number = 1,
    limit: number = 10,
    city?: string,
    region?: string,
  ): Promise<Location[]> {
    const cacheKey = `locations_page_${page}_limit_${limit}_city_${city}_region_${region}`;
    const cachedData = await this.cacheManager.get<Location[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query = this.locationRepository.createQueryBuilder('location');

    query.skip((page - 1) * limit).take(limit);

    // Filtrage par ville
    if (city) {
      query.andWhere('location.city LIKE :city', { city: `%${city}%` });
    }

    // Filtrage par région
    if (region) {
      query.andWhere('location.region LIKE :region', { region: `%${region}%` });
    }

    const locations = await query.getMany();
    await this.cacheManager.set(cacheKey, locations, 300); // Mise en cache pour 5 minutes

    return locations;
  }

  // Trouver une location par ID
  async findOne(id: number): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id },
      relations: ['users', 'events'],
    });
    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }
    return location;
  }

  // Mettre à jour une location existante
  async update(
    id: number,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const location = await this.findOne(id); // Vérifie si la location existe

    const updatedLocation = Object.assign(location, updateLocationDto);
    await this.locationRepository.save(updatedLocation);

    // Rafraîchir le cache
    await this.cacheManager.del(`locations_page_*`);

    return updatedLocation;
  }

  // Supprimer une location
  async remove(id: number): Promise<void> {
    const location = await this.findOne(id);
    await this.locationRepository.remove(location);

    // Supprimer le cache
    await this.cacheManager.del(`locations_page_*`);
  }
}
