import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Location } from 'src/location/entities/location.entity';
import { Event } from 'src/event/entities/event.entity';
import { Game } from 'src/game/entities/game.entity';
import { Participation } from 'src/participation/entities/participation.entity';
import { Message } from 'src/message/entities/message.entity';
import { Invite } from 'src/invite/entities/invite.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  age: number;

  @Column()
  interests: string;

  @Column('decimal', { precision: 3, scale: 1 })
  profile_rating: number;

  @ManyToOne(() => Location, (location) => location.users)
  location: Location;

  @OneToMany(() => Event, (event) => event.creator)
  eventsCreated: Event[];

  @ManyToMany(() => Game, (game) => game.users)
  @JoinTable({ name: 'PROPOSE_GAME' })
  gamesProposed: Game[];

  @OneToMany(() => Participation, (participation) => participation.user)
  participations: Participation[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => Invite, (invite) => invite.user)
  invites: Invite[];
}
