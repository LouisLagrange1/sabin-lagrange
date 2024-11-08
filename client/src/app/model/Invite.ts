import { Event } from "./Event";
import { User } from "./User";

export interface Invite {
  id: number;
  comment: string;
  rating: number;
  user: User; 
  event: Event;
}
