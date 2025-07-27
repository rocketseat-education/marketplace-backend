import { FastifyReply, FastifyRequest } from "fastify";
import { IUploadUserAvatarUseCase } from "../../../../domain/user/repositoryInterface/upload-user-avatar.interface";
import { UploadUserAvatarUseCase } from "../../../../domain/user/use-cases/upload-avatar";

export class UploadUserAvatarController {
  private uploadUserAvatarUseCase: UploadUserAvatarUseCase;

  constructor() {
    this.uploadUserAvatarUseCase = new UploadUserAvatarUseCase();
  }

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({
          error: "Nenhum arquivo foi enviado",
        });
      }

      const result = await this.uploadUserAvatarUseCase.execute({
        userId: request.user.id,
        file: {
          filename: data.filename || "unknown",
          mimetype: data.mimetype,
          file: data.file,
        },
      });

      return reply.status(200).send(result);
    } catch (error) {
      console.error("Erro no upload de avatar:", error);

      const message =
        error instanceof Error ? error.message : "Erro interno do servidor";

      return reply.status(500).send({
        error: message,
      });
    }
  };
}
