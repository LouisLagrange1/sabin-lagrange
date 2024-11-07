import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  // Créer un nouveau message
  @Post()
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messageService.create(createMessageDto);
  }

  // Récupérer tous les messages avec pagination et filtrage
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('senderId') senderId?: number,
    @Query('content') content?: string,
  ): Promise<Message[]> {
    return this.messageService.findAll(page, limit, senderId, content);
  }

  // Récupérer un message par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Message> {
    return this.messageService.findOne(id);
  }

  // Mettre à jour un message
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    return this.messageService.update(id, updateMessageDto);
  }

  // Supprimer un message
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.messageService.remove(id);
  }
}
