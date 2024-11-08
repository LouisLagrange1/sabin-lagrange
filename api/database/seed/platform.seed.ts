import { Repository } from 'typeorm';
import { Platform } from 'src/platform/entities/platform.entity';
import { Event } from 'src/event/entities/event.entity';

export async function seedPlatforms(
  platformRepository: Repository<Platform>,
  eventRepository: Repository<Event>,
) {
  // Récupérer un événement pour associer une plateforme
  const event = await eventRepository.findOne({
    where: { event_name: 'Concert de Rock' },
  });

  if (!event) {
    throw new Error('Event not found.');
  }

  const platforms = [
    {
      platform_name: 'Zoom',
      events: [event],
    },
    {
      platform_name: 'Twitch',
      events: [event],
    },
  ];

  // Sauvegarder les plateformes
  await platformRepository.save(platforms);
}
