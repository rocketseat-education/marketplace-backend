import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateProductsForeignKeys1750194530473
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createForeignKey(
      "products",
      new TableForeignKey({
        columnNames: ["category_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "categories",
        name: "FK_product_category_id",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("products", "FK_product_category_id");
  }
}
