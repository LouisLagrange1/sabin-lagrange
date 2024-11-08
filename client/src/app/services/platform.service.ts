import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platform } from '../model/Platform';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  private apiUrl = 'http://localhost:3000/platforms'; // Remplace par l'URL de ton API

  constructor(private http: HttpClient) {}

  // Récupérer toutes les plateformes
  getPlatforms(): Observable<Platform[]> {
    return this.http.get<Platform[]>(this.apiUrl);
  }

  // Récupérer une plateforme par ID
  getPlatformById(id: number): Observable<Platform> {
    return this.http.get<Platform>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle plateforme
  createPlatform(platform: Platform): Observable<Platform> {
    return this.http.post<Platform>(this.apiUrl, platform);
  }

  // Mettre à jour une plateforme
  updatePlatform(id: number, platform: Platform): Observable<Platform> {
    return this.http.put<Platform>(`${this.apiUrl}/${id}`, platform);
  }

  // Supprimer une plateforme
  deletePlatform(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
