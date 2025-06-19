import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Category } from "./Category";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "name", type: "varchar", nullable: false })
  name: string;

  @Column({ name: "description", type: "varchar", nullable: false })
  description: string;

  @Column({ name: "category_id", type: "int", nullable: false })
  categoryId: number;

  @Column({ name: "photo", type: "varchar", nullable: false })
  photo: string;

  @Column({ name: "value", type: "int", nullable: false })
  value: number;

  @Column({ name: "average_rating", type: "float", nullable: true, default: 0 })
  averageRating: number;

  @Column({ name: "rating_count", type: "int", nullable: true, default: 0 })
  ratingCount: number;

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
    nullable: false,
  })
  createdAt: Date;

  @OneToMany(() => Comment, (comment) => comment.product)
  comments?: Comment[];

  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category?: Category;
}
