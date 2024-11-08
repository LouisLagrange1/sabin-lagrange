import { Participation } from 'src/participation/entities/participation.entity';
import { User } from 'src/user/entities/user.entity';
import { Location } from 'src/location/entities/location.entity';
import { Invite } from 'src/invite/entities/invite.entity';
import { Platform } from 'src/platform/entities/platform.entity';
import { TypeEvent } from 'src/type_event/entities/type_event.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_name: string;

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

  @ManyToOne(() => Location, (location) => location.events)
  location: Location;

  @ManyToOne(() => User, (user) => user.eventsCreated)
  creator: User;

  @OneToMany(() => Participation, (participation) => participation.event)
  participations: Participation[];

  @OneToMany(() => Invite, (invite) => invite.event)
  invites: Invite[];

  @ManyToMany(() => Platform, (platform) => platform.events)
  @JoinTable({ name: 'USE_PLATFORM' })
  platforms: Platform[];

  @ManyToOne(() => TypeEvent, (typeEvent) => typeEvent.events, {
    nullable: false,
  })
  @JoinColumn({ name: 'typeId' })
  type: TypeEvent;
}
