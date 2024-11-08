import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';
import { Location } from 'src/location/entities/location.entity';
import { Platform } from 'src/platform/entities/platform.entity';
import { User } from 'src/user/entities/user.entity';
import { TypeEvent } from 'src/type_event/entities/type_event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Location, Platform, User, TypeEvent]),
    CacheModule.register(),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
