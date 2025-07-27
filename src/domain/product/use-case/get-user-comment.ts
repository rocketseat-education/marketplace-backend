import { ProductRepository } from "../../../infra/database/typeorm/market-place/repositories/product.repository";
import { GetUserComment } from "../interface/product-repository.interface";

export class GetUserCommentUseCase {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(params: GetUserComment) {
    const [comment, rating] = await Promise.all([
      this.productRepository.findUserComment(params),
      this.productRepository.findUserRating(params),
    ]);

    return {
      comment: comment ? {
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        user: {
          id: comment.user?.id,
          name: comment.user?.name,
        },
      } : null,
      rating: rating ? rating.value : null
    };
  }
}
