import { FastifySchema } from "fastify";
import S from "fluent-json-schema";

const body = S.object().prop("refreshToken", S.string().required());

const successResponse = S.object()
  .prop("token", S.string().required())
  .prop("refreshToken", S.string().required());

export const refreshTokenSchema: FastifySchema = {
  tags: ["Auth"],
  body,
  response: {
    200: successResponse,
    401: {
      $ref: "Unauthorized#",
    },
    404: {
      $ref: "NotFound#",
    },
    422: {
      $ref: "UnprocessableEntity#",
    },
    500: {
      $ref: "ServerError#",
    },
  },
};
