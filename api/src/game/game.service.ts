import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { User } from 'src/user/entities/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepository: Repository<Game>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Créer un nouveau jeu
  async create(createGameDto: CreateGameDto): Promise<Game> {
    // Créer une instance de jeu avec les données du DTO
    const game = this.gameRepository.create(createGameDto);

    // Sauvegarder et retourner l'événement
    return this.gameRepository.save(game);
  }

  // Trouver tous les jeux avec filtrage et pagination
  async findAll(
    page: number = 1,
    limit: number = 10,
    gameName?: string,
    gameType?: string,
    userId?: number,
  ): Promise<Game[]> {
    const cacheKey = `games_page_${page}_limit_${limit}_name_${gameName}_type_${gameType}_user_${userId}`;
    const cachedData = await this.cacheManager.get<Game[]>(cacheKey);

    // Si des données sont en cache, les retourner
    if (cachedData) {
      return cachedData;
    }

    // Création de la requête
    const query = this.gameRepository.createQueryBuilder('game');

    // Pagination
    query.skip((page - 1) * limit).take(limit);

    // Filtrage par nom de jeu
    if (gameName) {
      query.andWhere('game.game_name LIKE :gameName', {
        gameName: `%${gameName}%`,
      });
    }

    // Filtrage par type de jeu
    if (gameType) {
      query.andWhere('game.game_type LIKE :gameType', {
        gameType: `%${gameType}%`,
      });
    }

    // Filtrage par utilisateur (propose le jeu)
    if (userId) {
      query.andWhere('game.users.id = :userId', { userId });
    }

    // Exécution de la requête
    const games = await query.getMany();

    // Mise en cache pour 5 minutes
    await this.cacheManager.set(cacheKey, games, 300);

    return games;
  }

  // Trouver un jeu par ID avec les utilisateurs associés
  async findOne(id: number): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['users'], // Charger les utilisateurs qui ont proposé le jeu
    });

    // Si le jeu n'est pas trouvé, lancer une exception
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }

    return game;
  }

  // Mettre à jour un jeu
  async update(id: number, updateGameDto: UpdateGameDto): Promise<Game> {
    await this.gameRepository.update(id, updateGameDto);
    const updatedGame = await this.findOne(id);

    // Rafraîchir le cache
    await this.cacheManager.del(`games_page_*`);

    return updatedGame;
  }

  // Supprimer un jeu
  async remove(id: number): Promise<void> {
    const game = await this.findOne(id);
    await this.gameRepository.remove(game);

    // Supprimer le cache
    await this.cacheManager.del(`games_page_*`);
  }

  // Ajouter des utilisateurs à un jeu
  async addUsersToGame(gameId: number, userIds: number[]): Promise<Game> {
    const game = await this.findOne(gameId);
    const users = await this.userRepository.findByIds(userIds);
    game.users = users;
    return this.gameRepository.save(game);
  }
}
