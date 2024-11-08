import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  // Créer un nouveau message
  async create(createMessageDto: CreateMessageDto): Promise<Message> {
    const { content, message_date, senderId } = createMessageDto;

    // Trouver l'utilisateur qui a envoyé le message
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });

    if (!sender) {
      throw new NotFoundException(`Sender with ID ${senderId} not found`);
    }

    // Créer et sauvegarder le message
    const message = this.messageRepository.create({
      content,
      message_date,
      sender,
    });

    return this.messageRepository.save(message);
  }

  // Trouver tous les messages avec pagination et cache
  async findAll(
    page: number = 1,
    limit: number = 10,
    senderId?: number,
    content?: string,
  ): Promise<Message[]> {
    const cacheKey = `messages_page_${page}_limit_${limit}_sender_${senderId}_content_${content}`;
    const cachedData = await this.cacheManager.get<Message[]>(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const query = this.messageRepository.createQueryBuilder('message');

    query.skip((page - 1) * limit).take(limit);

    // Filtrage par ID de l'expéditeur
    if (senderId) {
      query.andWhere('message.sender.id = :senderId', { senderId });
    }

    // Filtrage par contenu de message
    if (content) {
      query.andWhere('message.content LIKE :content', {
        content: `%${content}%`,
      });
    }

    const messages = await query.getMany();

    // Mise en cache pour 5 minutes
    await this.cacheManager.set(cacheKey, messages, 300);

    return messages;
  }

  // Trouver un message par ID
  async findOne(id: number): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
      relations: ['sender'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  // Mettre à jour un message
  async update(
    id: number,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.findOne(id); // Vérifie si le message existe

    // Mettre à jour le message avec les données reçues
    const updatedMessage = Object.assign(message, updateMessageDto);
    await this.messageRepository.save(updatedMessage);

    // Rafraîchir le cache
    await this.cacheManager.del(`messages_page_*`);

    return updatedMessage;
  }

  // Supprimer un message
  async remove(id: number): Promise<void> {
    const message = await this.findOne(id);
    await this.messageRepository.remove(message);

    // Supprimer le cache
    await this.cacheManager.del(`messages_page_*`);
  }
}
