import { Like, Repository } from 'typeorm';
import { Invite } from 'src/invite/entities/invite.entity';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

export async function seedInvites(
  inviteRepository: Repository<Invite>,
  userRepository: Repository<User>,
  eventRepository: Repository<Event>,
) {
  // Recherche de l'utilisateur
  console.log('Searching for user with email: user1@example.com');
  const user = await userRepository.findOne({
    where: { email: 'user1@example.com' },
  });

  if (user) {
    console.log('User found:', user);
  } else {
    console.log('User not found');
  }

  // Recherche de l'événement
  console.log('Searching for event with name: Concert');
  const event = await eventRepository.findOne({
    where: {
      event_name: Like('%Concert%'), // Recherche partielle, "Concert" peut être dans n'importe quelle partie du nom
    },
  });

  if (event) {
    console.log('Event found:', event);
  } else {
    console.log('Event not found');
  }

  // Vérifier qu'on a trouvé l'utilisateur et l'événement
  if (!user || !event) {
    console.log('Error: User or Event not found');
    throw new Error('User or Event not found');
  }

  const invites = [
    { comment: 'Looking forward to it!', rating: 5, user, event },
    { comment: 'Not sure about the date', rating: 3, user, event },
  ];

  console.log('Creating invites:', invites);

  // Sauvegarde des invitations
  await inviteRepository.save(invites);
  console.log('Invites successfully created');
}
