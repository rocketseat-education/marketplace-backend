import { FastifyInstance } from "fastify";
import { registerSchema } from "./schemas/authentication/register.schema";
import { AuthenticateController } from "../controllers/user/authenticate.controller";
import { RegisterController } from "../controllers/user/register.controller";
import { loginSchema } from "./schemas/authentication/login.schema";
import { UpdateUserDataController } from "../controllers/user/update-user-data.controller";
import { updateUserDataSchema } from "./schemas/authentication/update-user-data.schema";
import { CheckAuthtenticationMiddleware } from "../middlewares/check-authentication";

export const configure = (fastify: FastifyInstance) => {
  const authenticateController = new AuthenticateController();
  const registerController = new RegisterController();
  const updateUserData = new UpdateUserDataController();
  const checkAuthenticated = new CheckAuthtenticationMiddleware();

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

  fastify.route({
    url: "/user",
    method: "put",
    handler: updateUserData.execute,
    preHandler: [checkAuthenticated.execute],
    schema: updateUserDataSchema,
  });

  fastify.route({
    url: "/user",
    method: "put",
    handler: updateUserData.execute,
    preHandler: [checkAuthenticated.execute],
    schema: updateUserDataSchema,
  });
};
