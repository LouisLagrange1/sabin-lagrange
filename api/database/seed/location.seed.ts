import { Repository } from 'typeorm';
import { Location } from 'src/location/entities/location.entity';

export async function seedLocations(locationRepository: Repository<Location>) {
  const locations = [
    { address: '456 Elm St', city: 'Lyon', region: 'Auvergne-Rhône-Alpes' },
    {
      address: '789 Pine St',
      city: 'Marseille',
      region: "Provence-Alpes-Côte d'Azur",
    },
  ];

  await locationRepository.save(locations);
}
