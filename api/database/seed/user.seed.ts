import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Location } from 'src/location/entities/location.entity';
import * as bcrypt from 'bcryptjs';

// Fonction de création de locations aléatoires pour chaque utilisateur
async function createRandomLocation(
  locationRepository: Repository<Location>,
): Promise<Location> {
  const cities = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice'];
  const regions = [
    'Île-de-France',
    "Provence-Alpes-Côte d'Azur",
    'Auvergne-Rhône-Alpes',
    'Nouvelle-Aquitaine',
    'Occitanie',
  ];

  const randomCity = cities[Math.floor(Math.random() * cities.length)];
  const randomRegion = regions[Math.floor(Math.random() * regions.length)];

  const randomAddress = `${Math.floor(Math.random() * 1000)} ${randomCity} Street`;

  // Création d'une location aléatoire
  const location = locationRepository.create({
    address: randomAddress,
    city: randomCity,
    region: randomRegion,
  });

  return await locationRepository.save(location);
}

export async function seedUsers(
  userRepository: Repository<User>,
  locationRepository: Repository<Location>,
) {
  // Création de locations pour chaque utilisateur (dynamique)
  const location1 = await createRandomLocation(locationRepository);
  const location2 = await createRandomLocation(locationRepository);

  const users = [
    {
      email: 'user1@example.com',
      username: 'SalutMoiCestPaul',
      password: 'password1',
      age: 25,
      interests: 'sports, reading',
      profile_rating: 4.5,
      location: location1, // Associer à la location générée dynamiquement
    },
    {
      email: 'user2@example.com',
      username: 'SalutMoiCestJulien',
      password: 'password2',
      age: 30,
      interests: 'gaming, travel',
      profile_rating: 4.0,
      location: location2, // Associer à la location générée dynamiquement
    },
  ];

  // Hachage des mots de passe des utilisateurs
  for (const user of users) {
    user.password = await bcrypt.hash(user.password, 10); // Hachage avec un facteur de coût de 10
  }

  // Sauvegarde des utilisateurs après avoir créé les locations
  await userRepository.save(users);
}
