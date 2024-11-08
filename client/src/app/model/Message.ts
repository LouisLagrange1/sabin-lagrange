import { User } from "./User";

export interface Message {
  id: number;
  content: string;
  message_date: Date;
  sender: User; // Représente l'utilisateur qui a envoyé le message
}
