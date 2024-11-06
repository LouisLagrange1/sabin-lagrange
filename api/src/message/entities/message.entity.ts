import { User } from 'src/user/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id_message: number;

  @Column()
  content: string;

  @Column()
  message_date: Date;

  @ManyToOne(() => User, (user) => user.messages)
  sender: User;
}
