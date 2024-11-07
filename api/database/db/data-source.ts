import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { Game } from 'src/game/entities/game.entity';
import { Location } from 'src/location/entities/location.entity';
import { Event } from 'src/event/entities/event.entity';
import { Platform } from 'src/platform/entities/platform.entity';
import { Participation } from 'src/participation/entities/participation.entity';
import { Message } from 'src/message/entities/message.entity';
import { Invite } from 'src/invite/entities/invite.entity';
import { TypeEvent } from 'src/type_event/entities/type_event.entity';
import { seedEvents } from 'database/seed/event.seed';
import { seedLocations } from 'database/seed/location.seed';
import { seedUsers } from 'database/seed/user.seed';
import { seedTypeEvents } from 'database/seed/type_event.seed';

// Initialisez le ConfigModule et ConfigService
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env', // assurez-vous que le chemin est correct
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
    User,
    Game,
    Location,
    Event,
    Platform,
    Participation,
    Message,
    Invite,
    TypeEvent,
  ],
  synchronize: true,
  logging: true,
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations_history',
});

// Initialisation et Seed
dataSource
  .initialize()
  .then(async () => {
    console.log('Seeding database...');

    const userRepository = dataSource.getRepository(User);
    const eventRepository = dataSource.getRepository(Event);
    const locationRepository = dataSource.getRepository(Location);
    const typeEventRepository = dataSource.getRepository(TypeEvent);

    await seedUsers(userRepository, locationRepository);
    await seedLocations(locationRepository);
    await seedTypeEvents(typeEventRepository);
    await seedEvents(
      eventRepository,
      userRepository,
      locationRepository,
      typeEventRepository,
    );

    console.log('Database seeded successfully!');
    process.exit(0);
  })
  .catch((error) => console.error('Error seeding database', error));
