import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateCommentUseCase } from "../../../../domain/product/use-case/update-comment";

interface UpdateCommentParams {
  commentId: string;
}

interface UpdateCommentBody {
  content: string;
  rating?: number;
}

export class UpdateCommentController {
  private updateCommentUseCase: UpdateCommentUseCase;

  constructor() {
    this.updateCommentUseCase = new UpdateCommentUseCase();
  }

  execute = async (
    request: FastifyRequest<{
      Params: UpdateCommentParams;
      Body: UpdateCommentBody;
    }>,
    reply: FastifyReply
  ) => {
    try {
      const { commentId } = request.params;
      const { content, rating } = request.body;
      const userId = request.user.id;

      const result = await this.updateCommentUseCase.execute({
        commentId: parseInt(commentId),
        content,
        userId,
        rating,
      });

      reply.send(result);
    } catch (error) {
      throw error;
    }
  };
}
