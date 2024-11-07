import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Location } from 'src/location/entities/location.entity';
import { Event } from 'src/event/entities/event.entity';
import { Game } from 'src/game/entities/game.entity';
import { Participation } from 'src/participation/entities/participation.entity';
import { Message } from 'src/message/entities/message.entity';
import { Invite } from 'src/invite/entities/invite.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Location,
      Event,
      Game,
      Participation,
      Message,
      Invite,
    ]),
    CacheModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
