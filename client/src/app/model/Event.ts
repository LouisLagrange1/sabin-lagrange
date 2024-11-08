import { Invite } from "./Invite";
import { Location } from "./Location";
import { Participation } from "./Participation";
import { Platform } from "./Platform";
import { TypeEvent } from "./Type-Event";
import { User } from "./User";

export interface Event {
  id: number;
  event_name: string;
  date: Date;
  time: string;
  number_of_places: number;
  is_paid: boolean;
  price: number;
  location: Location; // Remplacer "any" par un modèle Location si disponible
  creator: User; // Remplacer "any" par un modèle User si disponible
  participations: Participation[]; // Remplacer "any" par un modèle Participation si disponible
  invites: Invite[]; // Remplacer "any" par un modèle Invite si disponible
  platforms: Platform[]; // Remplacer "any" par un modèle Platform si disponible
  type: TypeEvent; // Remplacer "any" par un modèle TypeEvent si disponible
}
