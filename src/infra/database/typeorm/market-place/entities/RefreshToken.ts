import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("refresh_tokens")
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "token", type: "varchar", nullable: false, unique: true })
  token: string;

  @Column({ name: "user_id", type: "integer", nullable: false })
  userId: number;

  @Column({ name: "expires_at", type: "datetime", nullable: false })
  expiresAt: Date;

  @Column({ name: "is_revoked", type: "boolean", default: false })
  isRevoked: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "user_id" })
  user: User;
}
