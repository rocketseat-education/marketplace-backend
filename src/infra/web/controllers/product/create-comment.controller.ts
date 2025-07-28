import { FastifyReply, FastifyRequest } from "fastify";
import { CreateCommentUseCase } from "../../../../domain/product/use-case/create-comment";
import { CreateComment } from "../../../../domain/product/interface/product-repository.interface";

export class CreateCommentController {
  private createCommentLogic: CreateCommentUseCase;

  constructor() {
    this.createCommentLogic = new CreateCommentUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Body: CreateComment }>,
    reply: FastifyReply
  ) => {
    const params = request.body;
    const userId = request.user.id;
    const hasRating = params.rating !== undefined;
    await this.createCommentLogic.execute({ ...params, userId });

    const message = hasRating
      ? "Comentário e avaliação criados com sucesso!"
      : "Comentário criado com sucesso!";

    reply.send({
      message,
      ratingApplied: hasRating,
    });
  };
}
