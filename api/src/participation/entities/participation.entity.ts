import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';

@Entity('participation')
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true })
  rating: number;

  // Relation avec l'entité Event
  @ManyToOne(() => Event, (event) => event.participations)
  event: Event;

  // Relation avec l'entité User
  @ManyToOne(() => User, (user) => user.participations)
  user: User;
}
