import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserCommentUseCase } from "../../../../domain/product/use-case/get-user-comment";

interface GetUserCommentParams {
  productId: string;
}

export class GetUserCommentController {
  private getUserCommentUseCase: GetUserCommentUseCase;

  constructor() {
    this.getUserCommentUseCase = new GetUserCommentUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Params: GetUserCommentParams }>,
    reply: FastifyReply
  ) => {
    try {
      const { productId } = request.params;
      const userId = request.user.id;

      const result = await this.getUserCommentUseCase.execute({
        userId,
        productId: parseInt(productId),
      });
      reply.send(result);
    } catch (error) {
      throw error;
    }
  };
}
