import { Location } from '@angular/common';
import { Event } from './Event';
import { Game } from './Game';
import { Participation } from './Participation';
import { Message } from './Message';
import { Invite } from './Invite';

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;  // Note: Stocker les mots de passe de manière sécurisée (hash) dans une application réelle.
  age: number;
  interests: string;
  profile_rating: number;
  location: Location;
  eventsCreated: Event[];
  gamesProposed: Game[];
  participations: Participation[];
  messages: Message[];
  invites: Invite[];
}
