import { FastifyInstance } from "fastify";
import * as AuthRoutes from "./auth.routes";

export const register = (fasify: FastifyInstance) => {
  fasify.register((instance, _, done) => {
    AuthRoutes.configure(instance);
    done();
  });
};
