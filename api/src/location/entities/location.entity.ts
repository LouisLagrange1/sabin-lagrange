import { User } from 'src/user/entities/user.entity';
import { Event } from 'src/event/entities/event.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id_location: number;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  region: string;

  @OneToMany(() => User, (user) => user.location)
  users: User[];

  @OneToMany(() => Event, (event) => event.location)
  events: Event[];
}
