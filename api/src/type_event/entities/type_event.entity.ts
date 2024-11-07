import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';

@Entity('type_event')
export class TypeEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @OneToMany(() => Event, (event) => event.type)
  events: Event[];
}
