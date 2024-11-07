import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Event } from 'src/event/entities/event.entity';

@Entity()
export class Platform {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  platform_name: string;

  @ManyToMany(() => Event, (event) => event.platforms)
  events: Event[];
}
