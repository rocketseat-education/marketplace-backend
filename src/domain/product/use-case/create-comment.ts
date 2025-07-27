import { ProductRepository } from "../../../infra/database/typeorm/market-place/repositories/product.repository";
import { CreateComment } from "../interface/product-repository.interface";
import { BusinessError } from "../../../shared/errors/business.error";

export class CreateCommentUseCase {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(params: CreateComment): Promise<void> {
    if (params.rating !== undefined) {
      if (params.rating < 1 || params.rating > 5) {
        throw new BusinessError("O rating deve estar entre 1 e 5", 2001);
      }
    }

    await this.productRepository.createComment(params);

    if (params.rating !== undefined) {
      await this.productRepository.rateProdct({
        userId: params.userId,
        productId: params.productId,
        value: params.rating,
      });
    }
  }
}
