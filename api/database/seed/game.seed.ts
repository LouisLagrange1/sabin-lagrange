import { Repository } from 'typeorm';
import { Game } from 'src/game/entities/game.entity';
import { User } from 'src/user/entities/user.entity';

export async function seedGames(
  gameRepository: Repository<Game>,
  userRepository: Repository<User>,
) {
  const user = await userRepository.findOne({
    where: { email: 'user2@example.com' },
  });

  const games = [
    { game_name: 'Chess', game_type: 'strategy', users: [user] },
    { game_name: 'Poker', game_type: 'card', users: [user] },
  ];

  await gameRepository.save(games);
}
