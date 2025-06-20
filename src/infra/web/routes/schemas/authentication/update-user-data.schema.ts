import { FastifySchema } from "fastify";
import S from "fluent-json-schema";

const body = S.object()
  .prop("name", S.string())
  .prop("email", S.string())
  .prop("phone", S.string())
  .prop("password", S.string())
  .prop("newPassword", S.string());

const successResponse = S.object().prop("user", S.ref("User#"));

export const updateUserDataSchema: FastifySchema = {
  tags: ["Auth"],
  body,
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
