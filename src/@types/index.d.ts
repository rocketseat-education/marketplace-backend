import "fastify";
import { User } from "../infra/database/typeorm/market-place/entities/User";

declare module "fastify" {
  interface FastifyRequest {
    user: User;
  }
}
