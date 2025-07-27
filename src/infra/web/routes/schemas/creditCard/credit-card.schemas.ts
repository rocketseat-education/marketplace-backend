import S from "fluent-json-schema";

const getCreditCard = S.array().items(S.ref("CreditCard#"));

export const createCreditCardSchema = {
  description: "Criar um novo cartão de crédito",
  tags: ["Credit Cards"],
  security: [{ bearerAuth: [] }],
  body: {
    type: "object",
    required: ["number", "CVV", "expirationDate"],
    properties: {
      number: {
        type: "string",
        pattern: "^[0-9]{16}$",
        description: "Número do cartão (16 dígitos)",
      },
      CVV: {
        type: "integer",
        minimum: 100,
        maximum: 999,
        description: "Código de verificação (3 dígitos)",
      },
      expirationDate: {
        type: "string",
        format: "date",
        description: "Data de expiração do cartão (YYYY-MM-DD)",
      },
    },
    additionalProperties: false,
  },
  response: {
    201: {
      description: "Cartão de crédito criado com sucesso",
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            titularName: { type: "string" },
            number: { type: "string" },
            CVV: { type: "number" },
            expirationDate: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
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

export const getCreditCardsSchema = {
  description: "Buscar cartões de crédito por usuário",
  tags: ["Credit Cards"],
  security: [{ bearerAuth: [] }],
  response: {
    200: getCreditCard,
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

const getCreditCardByIdSchema = {
  description: "Buscar cartão de crédito por ID",
  tags: ["Credit Cards"],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "string",
        pattern: "^[0-9]+$",
        description: "ID do cartão de crédito",
      },
    },
    additionalProperties: false,
  },
  querystring: {
    type: "object",
    properties: {
      userId: {
        type: "string",
        pattern: "^[0-9]+$",
        description:
          "ID do usuário (opcional, para verificação de propriedade)",
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      description: "Cartão encontrado com sucesso",
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            userId: { type: "integer" },
            titularName: { type: "string" },
            number: { type: "string" },
            CVV: { type: "number" },
            expirationDate: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
    404: {
      description: "Cartão não encontrado",
      type: "object",
      properties: {
        success: { type: "boolean" },
        message: { type: "string" },
        error: { type: "string" },
      },
    },
  },
};
