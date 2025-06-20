import { Comment } from "../../../infra/database/typeorm/market-place/entities/Comment";
import { Product } from "../../../infra/database/typeorm/market-place/entities/Product";
import { OrderDirection } from "../../../interfaces/order-direction";
import { Paginated } from "../../../interfaces/paginated";

export interface GetProductsParams {
  productId: number;
  pagination?: {
    page: number;
    perPage: number;
  };
  filters: {
    from?: Date | undefined;
    to?: Date | undefined;
    categoryIds?: number[];
  };
  sort?: {
    averageRating?: OrderDirection;
  };
  searchText?: string;
}

export interface RateProduct {
  userId: number;
  productId: number;
  value: number;
}

export interface GetCommentsParams {
  productId: number;
  pagination?: {
    page: number;
    perPage: number;
  };
}

export interface CreateComment {
  content: string;
  userId: number;
  productId: number;
}

export interface ProductRepositoryInterface {
  getProducts(params: GetProductsParams): Promise<Paginated<Product>>;
  rateProdct(params: RateProduct): Promise<void>;
  findById(id: number): Promise<Product>;
  getComments(params: GetCommentsParams): Promise<Paginated<Comment>>;
  createComment(params: CreateComment): Promise<void>;
}
