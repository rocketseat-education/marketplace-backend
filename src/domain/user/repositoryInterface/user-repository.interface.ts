import { User } from "../../../infra/database/typeorm/market-place/entities/User";

export interface CreateUserParams {
  name: string;
  email: string;
  password: string;
}

export interface UploadProfiePhotoParams {
  userId: number;
  url: string;
}

export interface UserRepositoryInterface {
  createUser(user: CreateUserParams): Promise<User>;
  findByEmail(email: string): Promise<User>;
  uploadProfilePhoto(params: UploadProfiePhotoParams): Promise<string>;
  updateUserData(): Promise<User>;
}
