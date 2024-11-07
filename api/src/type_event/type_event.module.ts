import { Module } from '@nestjs/common';
import { TypeEventService } from './type_event.service';
import { TypeEventController } from './type_event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeEvent } from './entities/type_event.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeEvent, Event]),
    CacheModule.register(),
  ],
  controllers: [TypeEventController],
  providers: [TypeEventService],
})
export class TypeEventModule {}
