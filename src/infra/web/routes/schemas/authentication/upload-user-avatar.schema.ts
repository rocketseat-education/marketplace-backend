export const uploadUserAvatarSchema = {
  description: "Upload de avatar do usuário",
  tags: ["Auth"],
  security: [{ bearerAuth: [] }],
  consumes: ["multipart/form-data"],
  response: {
    200: {
      description: "Avatar atualizado com sucesso",
      type: "object",
      properties: {
        message: { type: "string" },
        filename: { type: "string" },
        url: { type: "string" },
      },
    },
    400: {
      description: "Erro de validação",
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    401: {
      description: "Não autorizado",
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      description: "Erro interno do servidor",
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};
