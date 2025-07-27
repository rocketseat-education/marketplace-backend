import { Product } from "../../../infra/database/typeorm/market-place/entities/Product";
import { ProductRepository } from "../../../infra/database/typeorm/market-place/repositories/product.repository";

export class FindProductByIdUseCase {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(id: number): Promise<Product> {
    return await this.productRepository.findById(id);
  }
}
