import { FastifySchema } from "fastify";
import S from "fluent-json-schema";

const successResponse = S.object()
  .prop("user", S.ref("User#"))
  .prop("token", S.string().required());

export const registerSchema: FastifySchema = {
  tags: ["Auth"],
  consumes: ["multipart/form-data"],
  response: {
    200: successResponse,
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
