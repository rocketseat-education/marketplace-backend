import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateUserParams } from "../../../../domain/user/repositoryInterface/user-repository.interface";
import { UpdateUserDataUseCase } from "../../../../domain/user/use-cases/update-user-data";

export class UpdateUserDataController {
  private updateUserDataUseCase: UpdateUserDataUseCase;

  constructor() {
    this.updateUserDataUseCase = new UpdateUserDataUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Body: Partial<UpdateUserParams> }>,
    reply: FastifyReply
  ) => {
    const userData = request.body;
    const email = request.user.email;
    userData.email = userData.email.toLowerCase();

    const user = await this.updateUserDataUseCase.execute(userData, email);
    reply.send({ user });
  };
}
