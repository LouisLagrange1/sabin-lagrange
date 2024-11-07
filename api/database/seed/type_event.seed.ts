import { Repository } from 'typeorm';
import { TypeEvent } from 'src/type_event/entities/type_event.entity';

export async function seedTypeEvents(
  typeEventRepository: Repository<TypeEvent>,
) {
  const types = [
    { label: 'Concert' },
    { label: 'Festival' },
    { label: 'Workshop' },
    { label: 'Conference' },
  ];

  // Vérifie si la table contient déjà des données pour éviter les doublons
  const existingTypes = await typeEventRepository.find();
  if (existingTypes.length === 0) {
    for (const typeData of types) {
      const typeEvent = typeEventRepository.create(typeData);
      await typeEventRepository.save(typeEvent);
    }
    console.log('TypeEvent records seeded successfully.');
  } else {
    console.log('TypeEvent records already exist, skipping seeding.');
  }
}
