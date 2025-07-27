import { ProductRepository } from "../../../infra/database/typeorm/market-place/repositories/product.repository";
import { UpdateComment } from "../interface/product-repository.interface";
import { BusinessError } from "../../../shared/errors/business.error";

export class UpdateCommentUseCase {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(params: UpdateComment) {
    if (params.rating !== undefined) {
      if (params.rating < 1 || params.rating > 5) {
        throw new BusinessError("O rating deve estar entre 1 e 5", 2001);
      }
    }

    const updatedComment = await this.productRepository.updateComment(params);

    const hasRating = params.rating !== undefined;
    const message = hasRating
      ? "Comentário e avaliação atualizados com sucesso!"
      : "Comentário atualizado com sucesso!";

    return {
      message,
      ratingUpdated: hasRating,
      comment: {
        id: updatedComment.id,
        content: updatedComment.content,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
      },
    };
  }
}
