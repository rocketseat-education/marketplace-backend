import { FastifyInstance } from "fastify";

import { CheckAuthtenticationMiddleware } from "../middlewares/check-authentication";
import { GetProductsController } from "../controllers/product/get-products.controller";
import { RateProductController } from "../controllers/product/rate-product.controller";
import { CreateCommentController } from "../controllers/product/create-comment.controller";
import { FindProductByIdController } from "../controllers/product/find-product.controller";
import { GetCommentsController } from "../controllers/product/get-comments.controller";
import {
  createCommentSchema,
  findProductByIdSchema,
  getCategoriesSchema,
  getCommentsSchema,
  getProductsSchema,
  getUserCommentSchema,
  rateProductSchema,
  updateCommentSchema,
} from "./schemas/product/products.chemas";
import { FindProductCategoriesByIdController } from "../controllers/product/find-product-categories.controller";
import { GetUserCommentController } from "../controllers/product/get-user-comment.controller";
import { UpdateCommentController } from "../controllers/product/update-comment.controller";

export const configure = (fastify: FastifyInstance) => {
  const getProductsController = new GetProductsController();
  const rateProductController = new RateProductController();
  const findProductByIdController = new FindProductByIdController();
  const getCommentsController = new GetCommentsController();
  const createCommentController = new CreateCommentController();
  const getUserCommentController = new GetUserCommentController();
  const updateCommentController = new UpdateCommentController();
  const checkAuthenticated = new CheckAuthtenticationMiddleware();
  const findProductCategoriesByIdController =
    new FindProductCategoriesByIdController();

  fastify.route({
    url: "/products",
    method: "post",
    preHandler: [checkAuthenticated.execute],
    handler: getProductsController.execute,
    schema: getProductsSchema,
  });

  fastify.route({
    url: "/products/rate",
    method: "post",
    preHandler: [checkAuthenticated.execute],
    handler: rateProductController.execute,
    schema: rateProductSchema,
  });

  fastify.route({
    url: "/products/:id",
    method: "get",
    handler: findProductByIdController.execute,
    preHandler: [checkAuthenticated.execute],
    schema: findProductByIdSchema,
  });

  fastify.route({
    url: "/products/categories",
    method: "get",
    handler: findProductCategoriesByIdController.execute,
    preHandler: [checkAuthenticated.execute],
    schema: getCategoriesSchema,
  });

  fastify.route({
    url: "/products/comments",
    method: "post",
    handler: getCommentsController.execute,
    preHandler: [checkAuthenticated.execute],
    schema: getCommentsSchema,
  });

  fastify.route({
    url: "/products/create/comments",
    method: "post",
    handler: createCommentController.execute,
    preHandler: [checkAuthenticated.execute],
    schema: createCommentSchema,
  });

  fastify.route({
    url: "/products/:productId/user-comment",
    method: "get",
    handler: getUserCommentController.execute,
    preHandler: [checkAuthenticated.execute],
    schema: getUserCommentSchema,
  });

  fastify.route({
    url: "/products/comments/:commentId",
    method: "put",
    handler: updateCommentController.execute,
    preHandler: [checkAuthenticated.execute],
    schema: updateCommentSchema,
  });
};
