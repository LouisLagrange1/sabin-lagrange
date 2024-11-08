import { Event } from "./Event";
import { User } from "./User";

export interface Location {
  id: number;
  address: string;
  city: string;
  region: string;
  users?: User[];
  events?: Event[]; 
}
