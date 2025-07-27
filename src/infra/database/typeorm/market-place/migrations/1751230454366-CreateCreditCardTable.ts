import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateCreditCardTable1751230454366 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "credit_cards",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "titular_name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "user_id",
            type: "integer",
            isNullable: false,
          },
          {
            name: "number",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "CVV",
            type: "integer",
            isNullable: false,
          },
          {
            name: "expiration_date",
            type: "datatime",
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
      "credit_cards",
      new TableForeignKey({
        name: "FK_user_id",
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("credit_cards", "FK_user_id");
    await queryRunner.dropTable("credit_cards");
  }
}
