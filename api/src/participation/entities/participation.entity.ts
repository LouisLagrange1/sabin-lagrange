import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Participation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  comment: string;

  @Column({ nullable: true, type: 'decimal', precision: 3, scale: 1 })
  rating: number;

  @ManyToOne(() => User, (user) => user.participations)
  user: User;

  @ManyToOne(() => Event, (event) => event.participations)
  event: Event;
}
