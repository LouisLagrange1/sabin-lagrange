import { Repository } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';
import { Location } from 'src/location/entities/location.entity';
import { TypeEvent } from 'src/type_event/entities/type_event.entity';

export async function seedEvents(
  eventRepository: Repository<Event>,
  userRepository: Repository<User>,
  locationRepository: Repository<Location>,
  typeEventRepository: Repository<TypeEvent>,
) {
  const user = await userRepository.findOne({
    where: { email: 'user1@example.com' },
  });
  const location = await locationRepository.findOne({
    where: { city: 'Paris' },
  });

  // Récupération d'un type d'événement pour l'assigner à l'événement
  const typeEvent = await typeEventRepository.findOne({
    where: { label: 'Concert' },
  });
  if (!typeEvent) {
    throw new Error(
      "TypeEvent 'Concert' not found. Please seed TypeEvent first.",
    );
  }

  const events = [
    {
      event_name: 'Concert de Rock',
      description: 'Concert live de rock',
      date: new Date(),
      time: '20:00', // Ajout de la valeur pour la colonne `time`
      number_of_places: 100,
      is_paid: true,
      price: 20.5,
      location,
      creator: user,
      type: typeEvent,
    },
    {
      event_name: 'Conférence sur la technologie',
      description: 'Conférence sur les nouvelles technologies',
      date: new Date(),
      time: '14:00', // Ajout de la valeur pour la colonne `time`
      number_of_places: 200,
      is_paid: false,
      price: 0,
      location,
      creator: user,
      type: typeEvent,
    },
  ];

  await eventRepository.save(events);
}
