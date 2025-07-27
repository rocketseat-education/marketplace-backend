import { FastifySchema } from "fastify";
import S from "fluent-json-schema";

const body = S.object()
  .prop("email", S.string().required().examples(["teste@gmail.com"]))
  .prop("password", S.string().required().examples(["123123123"]));

const successResponse = S.object()
  .prop("user", S.ref("User#"))
  .prop("token", S.string().required())
  .prop("refreshToken", S.string().required());

export const loginSchema: FastifySchema = {
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
