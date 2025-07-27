import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateOrdersTable1753623103688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "orders",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "user_id",
            type: "integer",
            isNullable: false,
          },
          {
            name: "credit_card_id",
            type: "integer",
            isNullable: false,
          },
          {
            name: "product_id",
            type: "integer",
            isNullable: false,
          },
          {
            name: "quantity",
            type: "integer",
            isNullable: false,
          },
          {
            name: "total_price",
            type: "decimal",
            precision: 10,
            scale: 2,
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
      "orders",
      new TableForeignKey({
        name: "FK_credit_card_id",
        columnNames: ["credit_card_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "credit_cards",
      })
    );

    await queryRunner.createForeignKey(
      "orders",
      new TableForeignKey({
        name: "FK_product_id",
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "products",
      })
    );

    await queryRunner.createForeignKey(
      "orders",
      new TableForeignKey({
        name: "FK_user_id",
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("orders", "FK_user_id");
    await queryRunner.dropForeignKey("orders", "FK_credit_card_id");
    await queryRunner.dropForeignKey("orders", "FK_product_id");
    await queryRunner.dropTable("orders");
  }
}
