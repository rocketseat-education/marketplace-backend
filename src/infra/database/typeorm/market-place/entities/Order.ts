import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { CreditCard } from "./CreditCard";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id", type: "integer" })
  userId: number;

  @Column({ name: "credit_card_id", type: "integer" })
  creditCardId: number;

  @Column({ name: "product_id", type: "integer" })
  productId: number;

  @Column({ type: "integer" })
  quantity: number;

  @Column("decimal", { precision: 10, scale: 2, name: "total_price" })
  totalPrice: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(() => CreditCard)
  @JoinColumn({ name: "credit_card_id" })
  creditCard: CreditCard;
}
