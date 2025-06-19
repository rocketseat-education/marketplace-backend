import { Comment } from "../../../infra/database/typeorm/market-place/entities/Comment";
import { Product } from "../../../infra/database/typeorm/market-place/entities/Product";
import { OrderDirection } from "../../../interfaces/order-direction";
import { Paginated } from "../../../interfaces/paginated";

export interface GetProductsParams {
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
  userId: number;
  content: string;
  productId: string;
}

export interface ProductRepositoryInterface {
  getProducts(params: GetProductsParams): Promise<Paginated<Product>>;
  rateProdct(params: RateProduct): Promise<void>;
  findById(id: number): Promise<Product>;
  getComments(params: GetCommentsParams): Promise<Paginated<Comment>>;
  createComments(params: CreateComment): Promise<void>;
}
