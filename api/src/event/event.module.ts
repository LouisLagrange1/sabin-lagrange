import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventController } from './event.controller';
import { Event } from './entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event]), CacheModule.register()],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
