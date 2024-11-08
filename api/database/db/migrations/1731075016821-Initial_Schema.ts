import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1731075016821 implements MigrationInterface {
    name = 'InitialSchema1731075016821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "participation" ("id" SERIAL NOT NULL, "status" character varying NOT NULL, "comment" character varying, "rating" numeric(3,1), "userId" integer, "eventId" integer, CONSTRAINT "PK_ba5442bab90fc96ddde456c69e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invite" ("id" SERIAL NOT NULL, "comment" character varying NOT NULL, "rating" integer NOT NULL, "userId" integer, "eventId" integer, CONSTRAINT "PK_fc9fa190e5a3c5d80604a4f63e1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "platform" ("id" SERIAL NOT NULL, "platform_name" character varying NOT NULL, CONSTRAINT "PK_c33d6abeebd214bd2850bfd6b8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "type_event" ("id" SERIAL NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_260880032a00f9cf26b748d3fc8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "event_name" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "time" character varying NOT NULL, "number_of_places" integer NOT NULL, "is_paid" boolean NOT NULL, "price" numeric NOT NULL, "locationId" integer, "creatorId" integer, "typeId" integer NOT NULL, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "location" ("id" SERIAL NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "region" character varying NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "message_date" TIMESTAMP NOT NULL, "senderId" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "age" integer NOT NULL, "interests" character varying NOT NULL, "profile_rating" numeric(3,1) NOT NULL, "locationId" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "game_name" character varying NOT NULL, "game_type" character varying NOT NULL, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "USE_PLATFORM" ("eventId" integer NOT NULL, "platformId" integer NOT NULL, CONSTRAINT "PK_b33bd606d6acaa961f48d61b0cf" PRIMARY KEY ("eventId", "platformId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8210d721d134fcee6d99f8a615" ON "USE_PLATFORM" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2bdbbfd610e53eeb14d387337c" ON "USE_PLATFORM" ("platformId") `);
        await queryRunner.query(`CREATE TABLE "PROPOSE_GAME" ("userId" integer NOT NULL, "gameId" integer NOT NULL, CONSTRAINT "PK_b0fd986bfea97ea478e9c49411d" PRIMARY KEY ("userId", "gameId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9734d6dc6d15c92a3cb80aab12" ON "PROPOSE_GAME" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cf675805eb4f3c4037fa06f8de" ON "PROPOSE_GAME" ("gameId") `);
        await queryRunner.query(`ALTER TABLE "participation" ADD CONSTRAINT "FK_8ed09e9b7e0a3a150f9515f254f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participation" ADD CONSTRAINT "FK_834f264f10c81e99c5355c3255f" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_91bfeec7a9574f458e5b592472d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invite" ADD CONSTRAINT "FK_cde6883963112e3ce027b1d7130" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_3abacb54776ac9da25ca49c609f" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_7a773352fcf1271324f2e5a3e41" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_255cc0faa667931c91431716165" FOREIGN KEY ("typeId") REFERENCES "type_event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_93e37a8413a5745a9b52bc3c0c1" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "USE_PLATFORM" ADD CONSTRAINT "FK_8210d721d134fcee6d99f8a6152" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "USE_PLATFORM" ADD CONSTRAINT "FK_2bdbbfd610e53eeb14d387337cf" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PROPOSE_GAME" ADD CONSTRAINT "FK_9734d6dc6d15c92a3cb80aab129" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "PROPOSE_GAME" ADD CONSTRAINT "FK_cf675805eb4f3c4037fa06f8de8" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PROPOSE_GAME" DROP CONSTRAINT "FK_cf675805eb4f3c4037fa06f8de8"`);
        await queryRunner.query(`ALTER TABLE "PROPOSE_GAME" DROP CONSTRAINT "FK_9734d6dc6d15c92a3cb80aab129"`);
        await queryRunner.query(`ALTER TABLE "USE_PLATFORM" DROP CONSTRAINT "FK_2bdbbfd610e53eeb14d387337cf"`);
        await queryRunner.query(`ALTER TABLE "USE_PLATFORM" DROP CONSTRAINT "FK_8210d721d134fcee6d99f8a6152"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_93e37a8413a5745a9b52bc3c0c1"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_255cc0faa667931c91431716165"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_7a773352fcf1271324f2e5a3e41"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_3abacb54776ac9da25ca49c609f"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_cde6883963112e3ce027b1d7130"`);
        await queryRunner.query(`ALTER TABLE "invite" DROP CONSTRAINT "FK_91bfeec7a9574f458e5b592472d"`);
        await queryRunner.query(`ALTER TABLE "participation" DROP CONSTRAINT "FK_834f264f10c81e99c5355c3255f"`);
        await queryRunner.query(`ALTER TABLE "participation" DROP CONSTRAINT "FK_8ed09e9b7e0a3a150f9515f254f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cf675805eb4f3c4037fa06f8de"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9734d6dc6d15c92a3cb80aab12"`);
        await queryRunner.query(`DROP TABLE "PROPOSE_GAME"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2bdbbfd610e53eeb14d387337c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8210d721d134fcee6d99f8a615"`);
        await queryRunner.query(`DROP TABLE "USE_PLATFORM"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "location"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "type_event"`);
        await queryRunner.query(`DROP TABLE "platform"`);
        await queryRunner.query(`DROP TABLE "invite"`);
        await queryRunner.query(`DROP TABLE "participation"`);
    }

}
