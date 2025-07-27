import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Category } from "./Category";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "name", type: "varchar", nullable: false })
  name: string;

  @Column({ name: "description", type: "varchar", nullable: false })
  description: string;

  @Column({ name: "height", type: "varchar", nullable: true })
  height?: string;

  @Column({ name: "width", type: "varchar", nullable: true })
  width?: string;

  @Column({ name: "weight", type: "varchar", nullable: true })
  weight?: string;

  @Column({ name: "category_id", type: "int", nullable: false })
  categoryId: number;

  @Column({ name: "views", type: "int", nullable: true })
  views?: number;

  @Column({ name: "photo", type: "varchar", nullable: false })
  photo: string;

  @Column({ name: "value", type: "int", nullable: false })
  value: string;

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

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: "category_id", referencedColumnName: "id" })
  category?: Category;
}
