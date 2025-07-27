import { User } from "../../../infra/database/typeorm/market-place/entities/User";

export interface AuthReponse {
  user: User;
  token: string;
  refreshToken: string;
}
