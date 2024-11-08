import { Event } from './Event';
import { User } from "./User";

export interface Participation {
  id: number;
  status: string;
  comment?: string;
  rating?: number;
  user: User;      
  event: Event;   
}
