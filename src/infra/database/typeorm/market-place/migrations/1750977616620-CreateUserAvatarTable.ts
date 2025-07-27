import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateUserAvatarTable1750977616620 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users_avatar",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "url",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "integer",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "datatime",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "datatime",
            isNullable: true,
          },
          {
            name: "deleted_at",
            type: "datatime",
            isNullable: true,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "users_avatar",
      new TableForeignKey({
        name: "FK_user_id",
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("users_avatar", "FK_user_id");
    await queryRunner.dropTable("users_avatar");
  }
}
