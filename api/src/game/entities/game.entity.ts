import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  game_name: string;

  @Column()
  game_type: string;

  @ManyToMany(() => User, (user) => user.gamesProposed)
  @JoinTable({ name: 'PROPOSE_GAME' })
  users: User[];
}
