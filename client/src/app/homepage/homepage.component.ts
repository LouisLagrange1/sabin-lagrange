import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Soiree {
  type: string;
  ville: string;
  organisateur: string;
  photoUrl: string;
  prix: number;
  date: Date;
  heure: Date;
  placesDisponibles: number;
}
@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  soirees: Soiree[] = [
    {
      type: 'Jeux de société',
      ville: 'Paris',
      organisateur: 'John Doe',
      photoUrl: 'https://source.unsplash.com/1600x900/?party',
      prix: 10,
      date: new Date('2023-11-15'),
      heure: new Date('2023-11-15T20:00:00'),
      placesDisponibles: 5,
    },
    {
      type: 'LAN Party',
      ville: 'Courbevoie',
      organisateur: 'Jane Smith',
      photoUrl: 'https://source.unsplash.com/1600x900/?gaming',
      prix: 0,
      date: new Date('2023-11-20'),
      heure: new Date('2023-11-20T18:00:00'),
      placesDisponibles: 8,
    },
    {
      type: 'Soirée Classique',
      ville: 'Lyon',
      organisateur: 'Alice Martin',
      photoUrl: 'https://source.unsplash.com/1600x900/?dance',
      prix: 15,
      date: new Date('2023-11-25'),
      heure: new Date('2023-11-25T22:00:00'),
      placesDisponibles: 20,
    },
    {
      type: 'Jeux de société',
      ville: 'Marseille',
      organisateur: 'Marc Dupont',
      photoUrl: 'https://source.unsplash.com/1600x900/?boardgame',
      prix: 5,
      date: new Date('2023-12-02'),
      heure: new Date('2023-12-02T19:30:00'),
      placesDisponibles: 10,
    },
    {
      type: 'LAN Party',
      ville: 'Bordeaux',
      organisateur: 'Emma Thomas',
      photoUrl: 'https://source.unsplash.com/1600x900/?computers',
      prix: 20,
      date: new Date('2023-12-10'),
      heure: new Date('2023-12-10T15:00:00'),
      placesDisponibles: 6,
    },
    {
      type: 'Soirée Classique',
      ville: 'Nantes',
      organisateur: 'Paul Lefevre',
      photoUrl: 'https://source.unsplash.com/1600x900/?music',
      prix: 0,
      date: new Date('2023-12-17'),
      heure: new Date('2023-12-17T21:00:00'),
      placesDisponibles: 25,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
