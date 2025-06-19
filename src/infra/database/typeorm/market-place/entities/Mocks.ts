import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("mocks")
export class Mock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name", type: "varchar", nullable: false })
  name: string;
}
