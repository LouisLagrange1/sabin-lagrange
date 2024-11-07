import { Module } from '@nestjs/common';
import { PlatformService } from './platform.service';
import { PlatformController } from './platform.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { Platform } from './entities/platform.entity';
import { Event } from 'src/event/entities/event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Platform, Event]),
    CacheModule.register(),
  ],
  controllers: [PlatformController],
  providers: [PlatformService],
})
export class PlatformModule {}
