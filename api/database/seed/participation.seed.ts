import { Repository } from 'typeorm';
import { Participation } from 'src/participation/entities/participation.entity';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';

export async function seedParticipations(
  participationRepository: Repository<Participation>,
  userRepository: Repository<User>,
  eventRepository: Repository<Event>,
) {
  // Récupérer des événements et des utilisateurs
  const user = await userRepository.findOne({
    where: { email: 'user1@example.com' },
  });
  const event = await eventRepository.findOne({
    where: { event_name: 'Concert de Rock' },
  });

  if (!user || !event) {
    throw new Error('User or Event not found.');
  }

  const participations = [
    {
      status: 'confirmed',
      comment: 'Looking forward to it!',
      rating: 5,
      event: event,
      user: user,
    },
    {
      status: 'pending',
      comment: 'Maybe attending.',
      rating: null,
      event: event,
      user: user,
    },
  ];

  // Sauvegarder les participations
  await participationRepository.save(participations);
}
