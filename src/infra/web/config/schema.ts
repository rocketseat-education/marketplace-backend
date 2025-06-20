import { FastifyInstance } from "fastify";
import S from "fluent-json-schema";

export const configure = (fastify: FastifyInstance) => {
  const unprocessableEntityResponse = S.object()
    .id("UnprocessableEntity")
    .prop("message", S.string())
    .prop("errors", S.array().items(S.string()))
    .description("Erro de validação.");

  const businessErrorResponse = S.object()
    .id("BusinessError")
    .prop("message", S.string())
    .prop(
      "internalErrorCode",
      S.number().enum([1]).description("1 - Username already registered")
    );

  const forbiddenResponse = S.object()
    .id("Forbidden")
    .prop("message", S.string());

  const notFoundErrorResponse = S.object()
    .id("NotFound")
    .prop("message", S.string());

  const unauthorizedErrorResponse = S.object()
    .id("Unauthorized")
    .prop("message", S.string());

  const errorResponse = S.object()
    .id("ServerError")
    .prop("message", S.string());

  const user = S.object()
    .id("User")
    .prop("id", S.number())
    .prop("name", S.string())
    .prop("email", S.string())
    .prop("url", S.oneOf([S.string(), S.null()]))
    .prop("photo", S.oneOf([S.string(), S.null()]))
    .prop("createdAt", S.string())
    .prop("updatedAt", S.string())
    .prop("deletedAt", S.oneOf([S.string().format("date-time"), S.null()]));

  const comment = S.object()
    .id("Comment")
    .prop("id", S.number())
    .prop("content", S.string())
    .prop("productId", S.string())
    .prop("userId", S.oneOf([S.string(), S.null()]))
    .prop(
      "user",
      S.object()
        .prop("id", S.number())
        .prop("name", S.string())
        .prop("eamil", S.string())
        .prop("photo", S.string())
    )
    .prop("createdAt", S.string())
    .prop("updatedAt", S.string())
    .prop("deletedAt", S.oneOf([S.string().format("date-time"), S.null()]));

  const category = S.object()
    .id("Category")
    .prop("id", S.number())
    .prop("name", S.string());

  const product = S.object()
    .id("Product")
    .prop("id", S.number().required())
    .prop("value", S.number().required())
    .prop("description", S.string().required())
    .prop("categoryId", S.number().required())
    .prop(
      "category",
      S.oneOf([S.object().prop("id", S.number()).prop("name", S.string())])
    )
    .prop("createdAt", S.string())
    .prop("updatedAt", S.string())
    .prop("deletedAt", S.oneOf([S.string().format("date-time"), S.null()]));

  const orderDirection = S.string()
    .enum(["ASC", "asc", "DESC", "desc"])
    .id("OrderDirection");

  fastify.addSchema(comment);
  fastify.addSchema(category);
  fastify.addSchema(product);
  fastify.addSchema(user);
  fastify.addSchema(orderDirection);
  fastify.addSchema(unprocessableEntityResponse);
  fastify.addSchema(businessErrorResponse);
  fastify.addSchema(forbiddenResponse);
  fastify.addSchema(notFoundErrorResponse);
  fastify.addSchema(unauthorizedErrorResponse);
  fastify.addSchema(errorResponse);
};
