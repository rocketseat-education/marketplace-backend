import { FastifyInstance } from "fastify";

import { CheckAuthtenticationMiddleware } from "../middlewares/check-authentication";
import { CreateOrderController } from "../controllers/order/create-order.controller";
import { GetUserOrdersController } from "../controllers/order/get-user-orders.controller";
import {
  createOrderSchema,
  getUserOrdersSchema,
} from "./schemas/product/products.chemas";

export const configure = (fastify: FastifyInstance) => {
  const createOrderController = new CreateOrderController();
  const getUserOrdersController = new GetUserOrdersController();
  const checkAuthenticated = new CheckAuthtenticationMiddleware();

  fastify.route({
    url: "/orders",
    method: "post",
    preHandler: [checkAuthenticated.execute],
    handler: createOrderController.execute,
    schema: createOrderSchema,
  });

  fastify.route({
    url: "/orders",
    method: "get",
    preHandler: [checkAuthenticated.execute],
    handler: getUserOrdersController.execute,
    schema: getUserOrdersSchema,
  });
};
