import { Product } from "../../../infra/database/typeorm/market-place/entities/Product";
import { ProductRepository } from "../../../infra/database/typeorm/market-place/repositories/product.repository";
import { Paginated } from "../../../interfaces/paginated";
import { GetProductsParams } from "../interface/product-repository.interface";

export class GetProductsUseCase {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(params: GetProductsParams): Promise<Paginated<Product>> {
    return await this.productRepository.getProducts(params);
  }
}
