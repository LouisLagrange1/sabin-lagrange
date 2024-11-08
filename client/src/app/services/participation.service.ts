// src/app/services/participation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Participation } from '../model/Participation';

@Injectable({
  providedIn: 'root'
})
export class ParticipationService {
  private apiUrl = 'http://localhost:3000/participations'; // Remplace par l'URL de ton API

  constructor(private http: HttpClient) {}

  // Récupérer toutes les participations
  getParticipations(): Observable<Participation[]> {
    return this.http.get<Participation[]>(this.apiUrl);
  }

  // Récupérer une participation par ID
  getParticipationById(id: number): Observable<Participation> {
    return this.http.get<Participation>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle participation
  createParticipation(participation: Participation): Observable<Participation> {
    return this.http.post<Participation>(this.apiUrl, participation);
  }

  // Mettre à jour une participation
  updateParticipation(id: number, participation: Participation): Observable<Participation> {
    return this.http.put<Participation>(`${this.apiUrl}/${id}`, participation);
  }

  // Supprimer une participation
  deleteParticipation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
