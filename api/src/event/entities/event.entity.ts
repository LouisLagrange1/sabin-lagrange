import { Participation } from 'src/participation/entities/participation.entity';
import { User } from 'src/user/entities/user.entity';
import { Location } from 'src/location/entities/location.entity';
import { Invite } from 'src/invite/entities/invite.entity';
import { Platform } from 'src/platform/entities/platform.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id_event: number;

  @Column()
  event_name: string;

  @ManyToOne(() => Location, (location) => location.events)
  location: Location;

  @Column()
  event_type: string;

  @Column()
  date: Date;

  @Column()
  time: string;

  @Column()
  number_of_places: number;

  @Column()
  is_paid: boolean;

  @Column('decimal')
  price: number;

  @ManyToOne(() => User, (user) => user.eventsCreated)
  creator: User;

  @OneToMany(() => Participation, (participation) => participation.event)
  participations: Participation[];

  @OneToMany(() => Invite, (invite) => invite.event)
  invites: Invite[];

  @ManyToMany(() => Platform)
  @JoinTable({ name: 'USE_PLATFORM' })
  platforms: Platform[];
}
