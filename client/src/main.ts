import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Configuration de l'application (ex: injection des services)
import { AppComponent } from './app/app.component'; // Le composant principal

// Démarre l'application Angular
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('Erreur de démarrage :', err)); // Capture d'éventuelles erreurs
