import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TypeEvent } from '../model/Type-Event';

@Injectable({
  providedIn: 'root'
})
export class TypeEventService {
  private apiUrl = 'http://localhost:3000/type-events'; // Remplace par l'URL de l'API

  constructor(private http: HttpClient) {}

  // Récupérer tous les types d'événements
  getTypeEvents(): Observable<TypeEvent[]> {
    return this.http.get<TypeEvent[]>(this.apiUrl);
  }

  // Récupérer un type d'événement par ID
  getTypeEventById(id: number): Observable<TypeEvent> {
    return this.http.get<TypeEvent>(`${this.apiUrl}/${id}`);
  }

  // Créer un nouveau type d'événement
  createTypeEvent(typeEvent: TypeEvent): Observable<TypeEvent> {
    return this.http.post<TypeEvent>(this.apiUrl, typeEvent);
  }

  // Mettre à jour un type d'événement
  updateTypeEvent(id: number, typeEvent: TypeEvent): Observable<TypeEvent> {
    return this.http.put<TypeEvent>(`${this.apiUrl}/${id}`, typeEvent);
  }

  // Supprimer un type d'événement
  deleteTypeEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
