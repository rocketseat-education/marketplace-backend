import { FastifyInstance } from "fastify";
import { registerSchema } from "./schemas/authentication/register.schema";
import { AuthenticateController } from "../controllers/user/authenticate.controller";
import { RegisterController } from "../controllers/user/register.controller";
import { loginSchema } from "./schemas/authentication/login.schema";

export const configure = (fastify: FastifyInstance) => {
  const authenticateController = new AuthenticateController();
  const registerController = new RegisterController();

  fastify.route({
    url: "/auth/register",
    method: "post",
    handler: registerController.execute,
    schema: registerSchema,
  });

  fastify.route({
    url: "/auth/login",
    method: "post",
    handler: authenticateController.execute,
    schema: loginSchema,
  });
};
