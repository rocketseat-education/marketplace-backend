import { Comment } from "../../../infra/database/typeorm/market-place/entities/Comment";
import { Product } from "../../../infra/database/typeorm/market-place/entities/Product";
import { Rating } from "../../../infra/database/typeorm/market-place/entities/Rating";
import { OrderDirection } from "../../../interfaces/order-direction";
import { Paginated } from "../../../interfaces/paginated";

export interface GetProductsParams {
  pagination?: {
    page: number;
    perPage: number;
  };
  filters?: {
    from?: Date | undefined;
    to?: Date | undefined;
    categoryIds?: number[];
    searchText?: string;
    minValue?: number;
    maxValue?: number;
  };
  sort?: {
    averageRating?: OrderDirection;
  };
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
  rating?: number;
}

export interface GetUserRating {
  userId: number;
  productId: number;
}

export interface GetUserComment {
  userId: number;
  productId: number;
}

export interface UpdateComment {
  commentId: number;
  content: string;
  userId: number;
  rating?: number;
}

export interface ProductRepositoryInterface {
  getProducts(params: GetProductsParams): Promise<Paginated<Product>>;
  rateProdct(params: RateProduct): Promise<void>;
  findById(id: number): Promise<Product>;
  getComments(params: GetCommentsParams): Promise<Paginated<Comment>>;
  createComment(params: CreateComment): Promise<void>;
  findUserRating(params: GetUserRating): Promise<Rating>;
  findUserComment(params: GetUserComment): Promise<Comment | null>;
  updateComment(params: UpdateComment): Promise<Comment>;
}
