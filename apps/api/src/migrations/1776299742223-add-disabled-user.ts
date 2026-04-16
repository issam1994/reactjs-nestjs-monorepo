import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDisabledUser1776299742223 implements MigrationInterface {
  name = 'AddDisabledUser1776299742223';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "disabled" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "disabled"`);
  }
}
