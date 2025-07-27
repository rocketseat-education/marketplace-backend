import { ProductRepository } from "../../../infra/database/typeorm/market-place/repositories/product.repository";
import { CreateComment } from "../interface/product-repository.interface";

export class CreateCommentUseCase {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(params: CreateComment): Promise<void> {
    return await this.productRepository.createComment(params);
  }
}
