import { FastifySchema } from "fastify";
import S from "fluent-json-schema";

const body = S.object()
  .prop("name", S.string().required().examples(["example"]))
  .prop("email", S.string().required().examples(["teste@gmail.com"]))
  .prop("avatarUrl", S.string())
  .prop("phone", S.string().required().examples(["00000000000"]))
  .prop("password", S.string().required().examples(["123123123"]));

const successResponse = S.object()
  .prop("user", S.ref("User#"))
  .prop("token", S.string().required());

export const registerSchema: FastifySchema = {
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
