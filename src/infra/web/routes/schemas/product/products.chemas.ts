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
      .prop("minValue", S.number())
      .prop("maxValue", S.number())
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
  .prop("productId", S.number().required())
  .prop("rating", S.number().minimum(1).maximum(5));

const createCommentResponse = S.object()
  .prop("message", S.string())
  .prop("ratingApplied", S.boolean());

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

export const getCategoriesSchema: FastifySchema = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  response: {
    200: S.array().items(S.ref("Category#")),
    401: { $ref: "Unauthorized#" },
    500: { $ref: "ServerError#" },
  },
};

const createOrderBody = S.object()
  .prop("creditCardId", S.number().required())
  .prop(
    "items",
    S.array()
      .items(
        S.object()
          .prop("productId", S.number().required())
          .prop("quantity", S.number().minimum(1).required())
      )
      .minItems(1)
      .required()
  );

const createOrderResponse = S.object()
  .prop("message", S.string())
  .prop("ordersCount", S.number())
  .prop(
    "orders",
    S.array().items(
      S.object()
        .prop("id", S.number())
        .prop("productId", S.number())
        .prop("quantity", S.number())
        .prop("totalPrice", S.number())
    )
  );

export const createOrderSchema: FastifySchema = {
  tags: ["Orders"],
  security: [{ bearerAuth: [] }],
  body: createOrderBody,
  response: {
    200: createOrderResponse,
    400: { $ref: "UnprocessableEntity#" },
    401: { $ref: "Unauthorized#" },
    404: { $ref: "NotFound#" },
    422: { $ref: "UnprocessableEntity#" },
    500: { $ref: "ServerError#" },
  },
};

const getUserOrdersResponse = S.object()
  .prop(
    "orders",
    S.array().items(
      S.object()
        .prop("id", S.number())
        .prop("productId", S.number())
        .prop("productName", S.string())
        .prop("productPhoto", S.string())
        .prop("quantity", S.number())
        .prop("totalPrice", S.number())
        .prop("createdAt", S.string().format("date-time"))
        .prop(
          "creditCard",
          S.object().prop("id", S.number()).prop("maskedNumber", S.string())
        )
    )
  )
  .prop("totalOrders", S.number());

export const getUserOrdersSchema: FastifySchema = {
  tags: ["Orders"],
  security: [{ bearerAuth: [] }],
  response: {
    200: getUserOrdersResponse,
    401: { $ref: "Unauthorized#" },
    500: { $ref: "ServerError#" },
  },
};

const getUserCommentParams = S.object().prop(
  "productId",
  S.string().required()
);

const getUserCommentResponse = S.object()
  .prop(
    "comment",
    S.anyOf([
      S.null(),
      S.object()
        .prop("id", S.number())
        .prop("content", S.string())
        .prop("createdAt", S.string().format("date-time"))
        .prop(
          "user",
          S.object().prop("id", S.number()).prop("name", S.string())
        ),
    ])
  )
  .prop("rating", S.anyOf([S.null(), S.number().minimum(1).maximum(5)]));

export const getUserCommentSchema: FastifySchema = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  params: getUserCommentParams,
  response: {
    200: getUserCommentResponse,
    401: { $ref: "Unauthorized#" },
    404: { $ref: "NotFound#" },
    500: { $ref: "ServerError#" },
  },
};

const updateCommentParams = S.object().prop("commentId", S.string().required());

const updateCommentBody = S.object()
  .prop("content", S.string().required())
  .prop("rating", S.number().minimum(1).maximum(5));

const updateCommentResponse = S.object()
  .prop("message", S.string())
  .prop("ratingUpdated", S.boolean())
  .prop(
    "comment",
    S.object()
      .prop("id", S.number())
      .prop("content", S.string())
      .prop("createdAt", S.string().format("date-time"))
      .prop("updatedAt", S.string().format("date-time"))
  );

export const updateCommentSchema: FastifySchema = {
  tags: ["Products"],
  security: [{ bearerAuth: [] }],
  params: updateCommentParams,
  body: updateCommentBody,
  response: {
    200: updateCommentResponse,
    400: { $ref: "UnprocessableEntity#" },
    401: { $ref: "Unauthorized#" },
    404: { $ref: "NotFound#" },
    422: { $ref: "UnprocessableEntity#" },
    500: { $ref: "ServerError#" },
  },
};
