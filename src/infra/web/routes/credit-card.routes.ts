import { FastifyInstance } from "fastify";
import { CheckAuthtenticationMiddleware } from "../middlewares/check-authentication";
import { CreditCardController } from "../controllers/creditCard/credit-card.controller";
import {
  createCreditCardSchema,
  getCreditCardsSchema,
} from "./schemas/creditCard/credit-card.schemas";

export const configure = (fastify: FastifyInstance) => {
  const creditCardController = new CreditCardController();
  const checkAuthenticated = new CheckAuthtenticationMiddleware();

  fastify.route({
    url: "/credit-cards",
    method: "get",
    preHandler: [checkAuthenticated.execute],
    handler: creditCardController.getUserCreditCards,
    schema: getCreditCardsSchema,
  });

  fastify.route({
    url: "/credit-cards",
    method: "post",
    preHandler: [checkAuthenticated.execute],
    handler: creditCardController.createCreditCard,
    schema: createCreditCardSchema,
  });
};
