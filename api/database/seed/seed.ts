import { dataSource } from '../db/data-source';
import { seedUsers } from './user.seed';
import { seedEvents } from './event.seed';
import { seedGames } from './game.seed';
import { seedInvites } from './invite.seed';
import { seedLocations } from './location.seed';
import { seedTypeEvents } from './type_event.seed';
import { seedPlatforms } from './platform.seed';
import { seedParticipations } from './participation.seed';
import { Game } from '../../src/game/entities/game.entity';
import { Invite } from '../../src/invite/entities/invite.entity';
import { Participation } from '../../src/participation/entities/participation.entity';
import { Platform } from '../../src/platform/entities/platform.entity';
import { TypeEvent } from '../../src/type_event/entities/type_event.entity';
import { User } from '../../src/user/entities/user.entity';
import { Location } from '../../src/location/entities/location.entity';
import { Event } from '../../src/event/entities/event.entity';

dataSource
  .initialize()
  .then(async () => {
    console.log('Seeding database...');

    const userRepository = dataSource.getRepository(User);
    const eventRepository = dataSource.getRepository(Event);
    const locationRepository = dataSource.getRepository(Location);
    const typeEventRepository = dataSource.getRepository(TypeEvent);
    const gameRepository = dataSource.getRepository(Game);
    const inviteRepository = dataSource.getRepository(Invite);
    const platformRepository = dataSource.getRepository(Platform);
    const participationRepository = dataSource.getRepository(Participation);

    await seedUsers(userRepository, locationRepository);
    await seedLocations(locationRepository);
    await seedTypeEvents(typeEventRepository);
    await seedEvents(
      eventRepository,
      userRepository,
      locationRepository,
      typeEventRepository,
    );
    await seedGames(gameRepository, userRepository);
    await seedInvites(inviteRepository, userRepository, eventRepository);
    await seedParticipations(
      participationRepository,
      userRepository,
      eventRepository,
    );
    await seedPlatforms(platformRepository, eventRepository);

    console.log('Database seeded successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during seeding', error);
    process.exit(1);
  });
