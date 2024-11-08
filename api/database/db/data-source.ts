import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { Game } from '../../src/game/entities/game.entity';
import { Invite } from '../../src/invite/entities/invite.entity';
import { TypeEvent } from '../../src/type_event/entities/type_event.entity';
import { User } from '../../src/user/entities/user.entity';
import { Location } from '../../src/location/entities/location.entity';
import { Event } from '../../src/event/entities/event.entity';
import { Platform } from '../../src/platform/entities/platform.entity';
import { Participation } from '../../src/participation/entities/participation.entity';
import { Message } from '../../src/message/entities/message.entity';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
});
const configService = new ConfigService();

export const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USERNAME'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [
    Game,
    Invite,
    TypeEvent,
    User,
    Location,
    Event,
    Platform,
    Participation,
    Message,
  ],
  synchronize: configService.get<boolean>('NODE_ENV') === false,
  logging: true,
  migrations: ['dist/database/db/migrations/*.js'],
  migrationsTableName: 'migrations_history',
});

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
