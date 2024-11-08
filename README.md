# PARTIFY Sabin-Lagrange

Partify is a social network platform that allows users to search or post a party

## Members of the team

- Louis LAGRANGE
- Marvin SABIN

## Installation

1. Clone the project repository using the following command:

   ```sh
   git clone https://github.com/LouisLagrange1/sabin-lagrange.git
   ```

### Installation Back end

1. Once the project is cloned and opened in your preferred IDE navigate to the project directory, then to the "api" folder with the command: `cd api`. Create a `.env` file at the root of the project and fill it with the following content:

```properties
PORT=3000 //Default Port
DATABASE_PASSWORD="your-password"
DATABASE_USERNAME="postgres"
DATABASE_PORT=
DATABASE_NAME="party"
DATABASE_HOST="localhost"
NODE_ENV=false //Developement
```

```yaml
DATABASE_PASSWORD: The password associated with the specified user. Keep it confidential for secure database connections.
```

```yaml
DATABASE_USERNAME: The username used for database authentication. This user should have necessary permissions for database operations.
```

```yaml
DATABASE_PORT: The port number on which the database server listens. Set this value to match your database configuration.
```

```yaml
DATABASE_NAME: The name of the specific database within the management system. In this case, set this parameter to "party".
```

```yaml
DATABASE_HOST: Specifies the hostname or IP address of the database server. It tells the application where to find the database.
```

```yaml
NODE_ENV: Specifies the environment mode, e.g., "false" or "true". Set it to "false" for local testing.

false = development
true = production
```

2. Instamint uses PostgreSQL as its database. Make sure you have postgres installed and create a database. If your database name is not "party" make sure to change the name of your database in the .env file.
   To be able to execute the command, make sure you have Node.js installed on your machine.

3. In your IDE's terminal, install all project dependencies by running:

   ```sh
   npm install
   ```

4. Generate Database Migrations: Run the following command to generate the initial schema for the database:

   ```sh
   npm run migration:generate --database/db/migrations/Initial_Schema
   ```

5. Run the Migrations: After generating the migrations, apply them to the database with the command:

   ```sh
   npm run migration:run
   ```

6. Seed the Database: Seed the database with initial data by running:

   ```sh
   npm run seed
   ```

7. Start the Application in Watch Mode: Finally, start the NestJS application with live reloading enabled:

   ```sh
   nest start --watch
   ```

### Instalation Front end

1. Once you have configured the backend, go to the client (frontend) part of the project by first running `cd ..` and then `cd client`.

2. Make sure you have Node.js version 20 installed by running

```
sh node -v
```

If you don’t have the correct version, run the following NVM commands:

```
nvm install 20
```

```
nvm use 20
```

If NVM is not installed, first run these two commands

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
```

```
source ~/.nvm/nvm.sh
```

3. Install all the dependencies with the command :

```
npm i
```

4. Run the front-end app with the command :

```
ng s
```

5. Open the application in your browser at the following URL:

```
localhost:4200
```

## À propos du projet

**Partify** est développé avec **Nest.js** et **Angular**, et utilise **TailwindCSS** pour le design frontend. La base de données est gérée avec **PostgreSQL**.

## Structure de la base de données

### Partition de la table `event`

Nous avons initialement essayé de partitionner la table `event` par date pour améliorer les performances de recherche. Cependant, en raison de certaines contraintes PostgreSQL (la clé primaire devant inclure toutes les colonnes de partition), cette solution n'a pas fonctionné comme prévu.

```typescript
// Création de la table partitionnée (non fonctionnelle)
await queryRunner.query(`
  CREATE TABLE "event" (
    "id" SERIAL NOT NULL, 
    "event_name" character varying NOT NULL, 
    "date" TIMESTAMP NOT NULL, 
    "time" character varying NOT NULL, 
    "number_of_places" integer NOT NULL, 
    "is_paid" boolean NOT NULL, 
    "price" numeric NOT NULL, 
    "locationId" integer, 
    "creatorId" integer, 
    "typeId" integer NOT NULL,
    CONSTRAINT "PK_event" PRIMARY KEY ("id", "date")
  ) PARTITION BY RANGE ("date");
`)
```

## Vue matérialisée event_view

Pour améliorer les performances de récupération des événements, nous avons créé une vue matérialisée qui joint les tables event, location, type_event, et user, afin de récupérer les événements avec leurs informations associées de manière plus rapide.

```typescript
// Création de la vue matérialisée
await queryRunner.query(`
  CREATE MATERIALIZED VIEW "event_view" AS
  SELECT 
    e.id,
    e.event_name,
    e.date,
    e.time,
    e.number_of_places,
    e.is_paid,
    e.price,
    l.address AS location_address,
    t.label AS type_label,
    u.username AS creator_username
  FROM "event" e
  LEFT JOIN "location" l ON e.locationId = l.id
  LEFT JOIN "type_event" t ON e.typeId = t.id
  LEFT JOIN "user" u ON e.creatorId = u.id;
`)
```

## Pagination et optimisation

La pagination a été ajoutée dans tous les contrôleurs et services pour limiter le nombre d'événements récupérés. De plus, nous avons optimisé le service eventService pour éviter les problèmes de requêtes N+1 en groupant les données liées dans des requêtes plus efficaces.
