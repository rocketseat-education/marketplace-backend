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

@Entity("credit_cards")
export class CreditCard {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "user_id", type: "int", nullable: false })
  userId: number;

  @Column({ name: "titular_name", type: "varchar", nullable: false })
  titularName: string;

  @Column({ name: "number", type: "varchar", nullable: false })
  number: string;

  @Column({ name: "CVV", type: "int", nullable: false })
  CVV: number;

  @Column({
    name: "expiration_date",
    type: "datetime",
    nullable: false,
  })
  expirationDate: Date;

  @CreateDateColumn({ name: "created_at", type: "datetime" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "datetime" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: "user_id" })
  user?: User;

  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt?: Date | null;
}
