import { User } from "../../../infra/database/typeorm/market-place/entities/User";

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

export interface UserRepositoryInterface {
  createUser(user: CreateUserParams): Promise<User>;
  findByEmail(email: string): Promise<User>;
}
