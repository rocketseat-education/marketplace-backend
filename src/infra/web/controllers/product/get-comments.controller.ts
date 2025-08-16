import { FastifyReply, FastifyRequest } from "fastify";
import { GetCommentsParams } from "../../../../domain/product/interface/product-repository.interface";
import { GetCommentsUseCase } from "../../../../domain/product/use-case/get-comments";

export class GetCommentsController {
  private getCommentsLogic: GetCommentsUseCase;

  constructor() {
    this.getCommentsLogic = new GetCommentsUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Body: GetCommentsParams }>,
    reply: FastifyReply
  ) => {
    const params = request.body;
    const comments = await this.getCommentsLogic.execute(params);
    reply.send(comments);
  };
}
