import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';  // Ajout de 'of' pour retourner un observable
import { HttpClient } from '@angular/common/http';
import { Event } from '../model/Event'; // Assurez-vous que le modèle Event est bien importé

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventsSubject = new BehaviorSubject<Event[]>([]);  // Créer un BehaviorSubject pour les événements
  public events = this.eventsSubject.asObservable();  // Observable pour exposer les événements

  private apiUrl = 'http://localhost:3000/events';  // URL de votre backend

  constructor(private http: HttpClient) {}

  // Méthode pour charger les événements
  public loadEvents(): void {
    this.http.get<Event[]>(this.apiUrl)
      .pipe(
        catchError((error) => {
          console.error('Error loading events:', error);
          // Retourne un tableau vide sous forme d'observable en cas d'erreur
          return of([]);  
        }),
        map((events) => {
          // Traiter les événements ici si nécessaire avant de les envoyer
          console.log(events)
          return events;
        })
      )
      .subscribe((events) => {
        this.eventsSubject.next(events);  // Mettre à jour le BehaviorSubject avec les nouveaux événements
      });
  }

  // Récupérer un événement par ID
  public getEventById(id: number): void {
    this.http.get<Event>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error) => {
          console.error(`Error loading event with ID ${id}:`, error);
          // Retourne null en cas d'erreur (ou une valeur par défaut si nécessaire)
          return of(null);  
        }),
        map((event) => event)  // Traiter l'événement ici si nécessaire
      )
      .subscribe((event) => {
        if (event) {
          // Si l'événement est trouvé, on peut le traiter ou l'afficher
          console.log('Event received:', event);
        }
      });
  }

  // Créer un nouvel événement
  public createEvent(event: Event): void {
    this.http.post<Event>(this.apiUrl, event)
      .pipe(
        catchError((error) => {
          console.error('Error creating event:', error);
          // Retourne null ou une valeur par défaut en cas d'erreur
          return of(null);
        }),
        map((createdEvent) => createdEvent)  // Traiter l'événement créé si nécessaire
      )
      .subscribe((createdEvent) => {
        if (createdEvent) {
          console.log('Event created:', createdEvent);
          // Optionnel : Ajouter l'événement créé à la liste des événements
          this.loadEvents();  // Recharger les événements après création
        }
      });
  }

  // Mettre à jour un événement
  public updateEvent(id: number, event: Event): void {
    this.http.put<Event>(`${this.apiUrl}/${id}`, event)
      .pipe(
        catchError((error) => {
          console.error(`Error updating event with ID ${id}:`, error);
          // Retourne null en cas d'erreur
          return of(null);
        }),
        map((updatedEvent) => updatedEvent)  // Traiter l'événement mis à jour si nécessaire
      )
      .subscribe((updatedEvent) => {
        if (updatedEvent) {
          console.log('Event updated:', updatedEvent);
          this.loadEvents();  // Recharger les événements après mise à jour
        }
      });
  }

  // Supprimer un événement
  public deleteEvent(id: number): void {
    this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error) => {
          console.error(`Error deleting event with ID ${id}:`, error);
          // Retourne un observable vide en cas d'erreur
          return of(undefined);  // Utilise 'of' pour retourner un observable vide
        })
      )
      .subscribe(() => {
        console.log(`Event with ID ${id} deleted`);
        this.loadEvents();  // Recharger les événements après suppression
      });
  }
}
