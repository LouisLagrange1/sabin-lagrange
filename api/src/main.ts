import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activation de CORS
  app.enableCors({
    origin: 'http://localhost:4200', // Remplace cela par l'URL de ton frontend si nécessaire
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Démarrer l'application NestJS
  await app.listen(process.env.PORT || 3000); // Utilise le port défini dans l'environnement ou 3000 par défaut
}
bootstrap();
