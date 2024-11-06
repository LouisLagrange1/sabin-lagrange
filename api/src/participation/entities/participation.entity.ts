import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id_participation: number;

  @Column()
  status: string;

  @Column()
  comment: string;

  @Column()
  rating: number;

  @ManyToOne(() => User, (user) => user.participations)
  user: User;

  @ManyToOne(() => Event, (event) => event.participations)
  event: Event;
}
