import { FastifySchema } from "fastify";
import S from "fluent-json-schema";

const getProductsBody = S.object()
  .prop(
    "pagination",
    S.object()
      .prop("page", S.number().examples([1]))
      .prop("perPage", S.number().examples([15]))
  )
  .prop(
    "filters",
    S.object()
      .prop("from", S.string().format("date-time"))
      .prop("to", S.string().format("date-time"))
      .prop("categoryIds", S.array().items(S.number()))
      .prop("searchText", S.string())
  )
  .prop("sort", S.object().prop("averageRating", S.ref("OrderDirection#")));

const paginatedProductsResponse = S.object()
  .prop("data", S.array().items(S.ref("Product#")))
  .prop("page", S.number())
  .prop("perPage", S.number())
  .prop("total", S.number())
  .prop("totalPages", S.number());

export const getProductsSchema: FastifySchema = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  body: getProductsBody,
  response: {
    200: paginatedProductsResponse,
    401: {
      $ref: "Unauthorized#",
    },
    422: {
      $ref: "UnprocessableEntity#",
    },
    500: {
      $ref: "ServerError#",
    },
  },
};

const rateProductBody = S.object()
  .prop("productId", S.number().required())
  .prop("value", S.number().required());

const rateProductResponse = S.object().prop("message", S.string());

export const rateProductSchema: FastifySchema = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  body: rateProductBody,
  response: {
    200: rateProductResponse,
    401: {
      $ref: "Unauthorized#",
    },
    422: {
      $ref: "UnprocessableEntity#",
    },
    500: {
      $ref: "ServerError#",
    },
  },
};

const findProductByIdParams = S.object().prop("id", S.string().required());

export const findProductByIdSchema: FastifySchema = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  params: findProductByIdParams,
  response: {
    200: S.ref("Product#"),
    401: {
      $ref: "Unauthorized#",
    },
    404: {
      $ref: "NotFound#",
    },
    500: {
      $ref: "ServerError#",
    },
  },
};

const getCommentsBody = S.object()
  .prop("productId", S.number().required())
  .prop(
    "pagination",
    S.object().prop("page", S.number()).prop("perPage", S.number())
  );

const paginatedCommentsResponse = S.object()
  .prop("data", S.array().items(S.ref("Comment#")))
  .prop("page", S.number())
  .prop("perPage", S.number())
  .prop("total", S.number())
  .prop("totalPages", S.number());

export const getCommentsSchema: FastifySchema = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  body: getCommentsBody,
  response: {
    200: paginatedCommentsResponse,
    401: {
      $ref: "Unauthorized#",
    },
    422: {
      $ref: "UnprocessableEntity#",
    },
    500: {
      $ref: "ServerError#",
    },
  },
};

const createCommentBody = S.object()
  .prop("content", S.string().required())
  .prop("productId", S.number().required());

const createCommentResponse = S.object().prop("message", S.string());

export const createCommentSchema: FastifySchema = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  body: createCommentBody,
  response: {
    200: createCommentResponse,
    401: {
      $ref: "Unauthorized#",
    },
    422: {
      $ref: "UnprocessableEntity#",
    },
    500: {
      $ref: "ServerError#",
    },
  },
};
