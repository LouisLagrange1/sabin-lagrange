import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { Game } from './game/entities/game.entity';
import { Invite } from './invite/entities/invite.entity';
import { Message } from './message/entities/message.entity';
import { Participation } from './participation/entities/participation.entity';
import { Platform } from './platform/entities/platform.entity';
import { User } from './user/entities/user.entity';
import { Location } from './location/entities/location.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [
          User,
          Game,
          Location,
          Event,
          Platform,
          Participation,
          Message,
          Invite,
          Location,
        ],
        synchronize: true,
      }),
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
