import { FastifyReply, FastifyRequest } from "fastify";
import { AuthenticateUseCase } from "../../../../domain/user/use-cases/authenticate";
import { AuthLoginRequest } from "../../../../domain/user/interfaces/authLoginRequest";

export class AuthenticateController {
  private authLogic: AuthenticateUseCase;

  constructor() {
    this.authLogic = new AuthenticateUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Body: AuthLoginRequest }>,
    reply: FastifyReply
  ) => {
    const userData = request.body;
    userData.email = userData.email.toLowerCase();

    const user = await this.authLogic.execute(userData);

    reply.send(user);
  };
}
