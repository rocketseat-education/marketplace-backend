import { Comment } from "../../../infra/database/typeorm/market-place/entities/Comment";
import { ProductRepository } from "../../../infra/database/typeorm/market-place/repositories/product.repository";
import { Paginated } from "../../../interfaces/paginated";
import { GetCommentsParams } from "../interface/product-repository.interface";

export class GetCommentsUseCase {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async execute(params: GetCommentsParams): Promise<Paginated<Comment>> {
    const productsResponse = await this.productRepository.getComments(params);
    const { productId } = params;

    const data = productsResponse.data.map((product) => ({
      ...product,
      user: {
        ...product.user,
        rating: product.user?.ratings?.find(
          (rating) => rating.productId === productId
        ),
      },
    }));
    return {
      ...productsResponse,
      data,
    };
  }
}
