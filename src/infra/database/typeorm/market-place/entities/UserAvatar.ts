import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("users_avatar")
export class UserAvatar {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: "url", type: "varchar", nullable: false })
  url: string;

  @Column({ name: "user_id", type: "varchar", nullable: false })
  userId: number;

  @OneToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: "user_id" })
  user?: User;

  @CreateDateColumn({
    name: "created_at",
    type: "datetime",
    nullable: false,
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: "updated_at",
    type: "datetime",
    nullable: false,
  })
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at", type: "datetime", nullable: true })
  deletedAt?: Date | null;
}
