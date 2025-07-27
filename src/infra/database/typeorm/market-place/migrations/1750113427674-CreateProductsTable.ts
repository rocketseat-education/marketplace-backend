import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateProductsTable1750113427674 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "products",
        columns: [
          {
            name: "id",
            type: "integer",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "description",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "photo",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "value",
            type: "integer",
            isNullable: false,
          },
          {
            name: "width",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "weight",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "height",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "views",
            type: "integer",
            isNullable: true,
          },
          {
            name: "average_rating",
            type: "float",
            isNullable: false,
          },
          {
            name: "rating_count",
            type: "integer",
            isNullable: false,
          },
          {
            name: "category_id",
            type: "integer",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamptz",
            isNullable: false,
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("products");
  }
}
