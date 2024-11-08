import { Repository } from 'typeorm';
import { Invite } from 'src/invite/entities/invite.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

export async function seedInvites(
  inviteRepository: Repository<Invite>,
  userRepository: Repository<User>,
  eventRepository: Repository<Event>,
) {
  // Trouver un utilisateur et un événement existants
  const user = await userRepository.findOne({
    where: { email: 'user1@example.com' },
  });
  const event = await eventRepository.findOne({
    where: { event_name: 'Concert' },
  });

  // Vérifier qu'on a trouvé l'utilisateur et l'événement
  if (!user || !event) {
    throw new Error('User or Event not found');
  }

  const invites = [
    { comment: 'Looking forward to it!', rating: 5, user, event },
    { comment: 'Not sure about the date', rating: 3, user, event },
  ];

  await inviteRepository.save(invites); // Assurez-vous que 'comment' n'est pas vide
}
