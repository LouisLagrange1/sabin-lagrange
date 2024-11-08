import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { ParticipationModule } from './participation/participation.module';
import { MessageModule } from './message/message.module';
import { PlatformModule } from './platform/platform.module';
import { GameModule } from './game/game.module';
import { TypeEventModule } from './type_event/type_event.module';
import { LocationModule } from './location/location.module';
import { InviteModule } from './invite/invite.module';
import { CacheModule } from '@nestjs/cache-manager';
import { dataSource } from 'database/db/data-source';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5 * 60,
      max: 100,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSource.options,
      autoLoadEntities: true,
    }),
    EventModule,
    UserModule,
    ParticipationModule,
    MessageModule,
    PlatformModule,
    GameModule,
    TypeEventModule,
    LocationModule,
    InviteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  async onModuleInit() {
    this.logger.log('Database initialized successfully');
  }
}
