import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity("products_rating")
export class Rating {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "user_id", type: "int", nullable: false })
  userId: number;

  @Column({ name: "product_id", type: "int", nullable: false })
  productId: number;

  @Column({ name: "value", type: "int", nullable: false })
  value: number;

  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: "user_id" })
  user?: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product?: Product;
}
