import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductTable1772189081901 implements MigrationInterface {
    name = 'CreateProductTable1772189081901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "productCode" character varying NOT NULL, "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "unit" character varying NOT NULL, "imageUrl" character varying, "category" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3146a8c669fc3f362c02fa9e0ba" UNIQUE ("productCode"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
