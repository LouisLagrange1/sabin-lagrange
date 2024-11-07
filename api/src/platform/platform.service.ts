import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CreatePlatformDto } from './dto/create-platform.dto';
import { UpdatePlatformDto } from './dto/update-platform.dto';
import { Platform } from './entities/platform.entity';
import { Event } from 'src/event/entities/event.entity';

@Injectable()
export class PlatformService {
  constructor(
    @InjectRepository(Platform)
    private platformRepository: Repository<Platform>,

    @InjectRepository(Event)
    private eventRepository: Repository<Event>,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Créer une nouvelle plateforme
  async create(createPlatformDto: CreatePlatformDto): Promise<Platform> {
    const { platform_name } = createPlatformDto;

    const platform = this.platformRepository.create({
      platform_name,
    });

    return this.platformRepository.save(platform);
  }

  // Trouver toutes les plateformes avec pagination
  async findAll(
    page: number = 1,
    limit: number = 10,
    platformName?: string,
  ): Promise<Platform[]> {
    const cacheKey = `platforms_page_${page}_limit_${limit}_name_${platformName}`;
    const cachedData = await this.cacheManager.get<Platform[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query = this.platformRepository.createQueryBuilder('platform');
    query.skip((page - 1) * limit).take(limit);

    // Filtrage par nom de plateforme
    if (platformName) {
      query.andWhere('platform.platform_name LIKE :platformName', {
        platformName: `%${platformName}%`,
      });
    }

    const platforms = await query.getMany();
    await this.cacheManager.set(cacheKey, platforms, 300);

    return platforms;
  }

  // Trouver une plateforme par ID
  async findOne(id: number): Promise<Platform> {
    const platform = await this.platformRepository.findOne({
      where: { id },
      relations: ['events'], // Charger les événements associés à cette plateforme
    });

    if (!platform) {
      throw new NotFoundException(`Platform with ID ${id} not found`);
    }

    return platform;
  }

  // Mettre à jour une plateforme
  async update(
    id: number,
    updatePlatformDto: UpdatePlatformDto,
  ): Promise<Platform> {
    await this.platformRepository.update(id, updatePlatformDto);
    const updatedPlatform = await this.findOne(id);

    // Rafraîchir le cache
    await this.cacheManager.del(`platforms_page_*`);

    return updatedPlatform;
  }

  // Supprimer une plateforme
  async remove(id: number): Promise<void> {
    const platform = await this.findOne(id);
    await this.platformRepository.remove(platform);

    // Supprimer le cache
    await this.cacheManager.del(`platforms_page_*`);
  }

  // Ajouter des événements à une plateforme
  async addEventsToPlatform(
    platformId: number,
    eventIds: number[],
  ): Promise<Platform> {
    const platform = await this.findOne(platformId);
    const events = await this.eventRepository.findByIds(eventIds);
    platform.events = events;
    return this.platformRepository.save(platform);
  }
}
