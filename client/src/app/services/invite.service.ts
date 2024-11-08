import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invite } from '../model/Invite';

@Injectable({
  providedIn: 'root'
})
export class InviteService {
  private apiUrl = 'http://localhost:3000/invites'; // Remplace par l'URL de ton API

  constructor(private http: HttpClient) {}

  // Récupérer toutes les invitations
  getInvites(): Observable<Invite[]> {
    return this.http.get<Invite[]>(this.apiUrl);
  }

  // Récupérer une invitation par ID
  getInviteById(id: number): Observable<Invite> {
    return this.http.get<Invite>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle invitation
  createInvite(invite: Invite): Observable<Invite> {
    return this.http.post<Invite>(this.apiUrl, invite);
  }

  // Mettre à jour une invitation
  updateInvite(id: number, invite: Invite): Observable<Invite> {
    return this.http.put<Invite>(`${this.apiUrl}/${id}`, invite);
  }

  // Supprimer une invitation
  deleteInvite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
