import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserParams } from "../../../../domain/user/repositoryInterface/user-repository.interface";
import { RegisterUseCase } from "../../../../domain/user/use-cases/register";

export class RegisterController {
  private authLogic: RegisterUseCase;

  constructor() {
    this.authLogic = new RegisterUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Body: CreateUserParams }>,
    reply: FastifyReply
  ) => {
    const userData = request.body;
    userData.email = userData.email.toLowerCase();

    const user = await this.authLogic.execute(userData);

    reply.send(user);
  };
}
