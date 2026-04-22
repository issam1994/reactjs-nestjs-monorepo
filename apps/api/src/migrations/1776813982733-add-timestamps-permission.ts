import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampsPermission1776813982733 implements MigrationInterface {
  name = 'AddTimestampsPermission1776813982733';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "createdAt"`);
  }
}
