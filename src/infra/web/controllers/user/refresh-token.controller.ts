import { FastifyReply, FastifyRequest } from "fastify";
import { RefreshTokenUseCase } from "../../../../domain/user/use-cases/refresh-token";

interface RefreshTokenBody {
  refreshToken: string;
}

export class RefreshTokenController {
  private refreshTokenUseCase: RefreshTokenUseCase;

  constructor() {
    this.refreshTokenUseCase = new RefreshTokenUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Body: RefreshTokenBody }>,
    reply: FastifyReply
  ) => {
    try {
      const { refreshToken } = request.body;

      const result = await this.refreshTokenUseCase.execute({ refreshToken });

      reply.send(result);
    } catch (error) {
      throw error;
    }
  };
}
