import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Location } from 'src/location/entities/location.entity';

export async function seedUsers(
  userRepository: Repository<User>,
  locationRepository: Repository<Location>,
) {
  const location = await locationRepository.save({
    address: '123 Main St',
    city: 'Paris',
    region: 'Île-de-France',
  });

  const users = [
    {
      email: 'user1@example.com',
      password: 'password1',
      age: 25,
      interests: 'sports, reading',
      profile_rating: 4.5,
      location,
    },
    {
      email: 'user2@example.com',
      password: 'password2',
      age: 30,
      interests: 'gaming, travel',
      profile_rating: 4.0,
      location,
    },
  ];

  await userRepository.save(users);
}
