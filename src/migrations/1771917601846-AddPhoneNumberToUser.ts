import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneNumberToUser1771917601846 implements MigrationInterface {
    name = 'AddPhoneNumberToUser1771917601846'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phoneNumber" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phoneNumber"`);
    }

}
