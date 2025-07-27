import { ProductRepository } from "../../../infra/database/typeorm/market-place/repositories/product.repository";
import { RateProduct } from "../interface/product-repository.interface";

export class RateProductUseCase {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(params: RateProduct): Promise<void> {
    return await this.productRepository.rateProdct(params);
  }
}
