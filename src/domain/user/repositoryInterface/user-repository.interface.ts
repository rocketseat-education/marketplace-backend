import { User } from "../../../infra/database/typeorm/market-place/entities/User";
import { UserAvatar } from "../../../infra/database/typeorm/market-place/entities/UserAvatar";
import { CreditCard } from "../../../infra/database/typeorm/market-place/entities/CreditCard";

export interface CreateUserParams {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  password: string;
}

export interface UpdateUserParams extends CreateUserParams {
  newPassword?: string;
}

export interface UploadProfiePhotoParams {
  userId: number;
  url: string;
}

export interface UpdateAvatarUrlParams {
  userId: number;
  url: number;
}

export interface CreateCreditCardParams {
  userId: number;
  titularName: string;
  number: string;
  CVV: number;
  value: number;
  expirationDate: Date;
}

export interface UpdateCreditCardParams
  extends Partial<CreateCreditCardParams> {
  id: number;
}

export interface UserRepositoryInterface {
  createUser(user: CreateUserParams): Promise<User>;
  findByEmail(email: string): Promise<User>;
  updateUserAvatar(params: UploadProfiePhotoParams): Promise<string>;
  updateUserData(params: Partial<CreateUserParams>): Promise<User>;
  createCreditCard(creditCard: CreateCreditCardParams): Promise<CreditCard>;
  findCreditCardsByUserId(userId: number): Promise<CreditCard[]>;
  findCreditCardById(id: number): Promise<CreditCard>;
  updateCreditCard(params: UpdateCreditCardParams): Promise<CreditCard>;
  deleteCreditCard(id: number): Promise<void>;
}
