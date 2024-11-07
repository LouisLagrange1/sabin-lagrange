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
import { InviteService } from './invite.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { Invite } from './entities/invite.entity';

@Controller('invites')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  // Créer une nouvelle invitation
  @Post()
  async create(@Body() createInviteDto: CreateInviteDto): Promise<Invite> {
    return this.inviteService.create(createInviteDto);
  }

  // Récupérer toutes les invitations avec pagination et filtrage
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('userId') userId?: number,
    @Query('eventId') eventId?: number,
  ): Promise<Invite[]> {
    return this.inviteService.findAll(page, limit, userId, eventId);
  }

  // Récupérer une invitation par son ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Invite> {
    return this.inviteService.findOne(id);
  }

  // Mettre à jour une invitation
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateInviteDto: UpdateInviteDto,
  ): Promise<Invite> {
    return this.inviteService.update(id, updateInviteDto);
  }

  // Supprimer une invitation
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.inviteService.remove(id);
  }
}
