import { FastifySchema } from "fastify";
import S from "fluent-json-schema";

const body = S.object()
  .prop("name", S.string().required().examples(["Novo nome"]))
  .prop("email", S.string().required().examples(["novo_teste@gmail.com"]))
  .prop("phone", S.string().required().examples(["11111111111"]))
  .prop("password", S.string().examples(["123123123"]))
  .prop("newPassword", S.string().examples(["123456789"]));

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
