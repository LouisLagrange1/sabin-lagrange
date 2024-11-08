import { User } from "./User";

export interface Game {
  id: number;
  game_name: string;
  game_type: string;
  users: User[]; // Remplacer "any" par un modèle User si disponible
}
