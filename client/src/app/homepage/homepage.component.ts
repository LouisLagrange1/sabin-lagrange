import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../services/event.service';
import { Observable } from 'rxjs';
import { Event } from '../model/Event';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
})
export class HomepageComponent implements OnInit {
  soirees$: Observable<Event[]> | undefined;  // Déclarer l'observable sans initialisation directe

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.loadEvents(); // Charger les événements depuis le service
    this.soirees$ = this.eventService.events; // Initialiser soirees$ après avoir chargé les événements
  }
}
