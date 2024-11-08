import { Event } from "./Event";

export interface Platform {
  id: number;
  platform_name: string;
  events: Event[];  // Liste des événements liés à cette plateforme
}
