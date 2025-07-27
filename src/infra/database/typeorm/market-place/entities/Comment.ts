import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "content", type: "varchar", nullable: false })
  content: string;

  @Column({ name: "user_id", type: "int", nullable: false })
  userId: number;

  @Column({ name: "product_id", type: "int", nullable: false })
  productId: number;

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "datetime",
    nullable: false,
  })
  updatedAt: Date | null;

  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt?: Date | null;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  user?: User;

  @ManyToOne(() => Product, (product) => product.comments)
  @JoinColumn({ name: "user_id", referencedColumnName: "id" })
  product?: Product;
}
