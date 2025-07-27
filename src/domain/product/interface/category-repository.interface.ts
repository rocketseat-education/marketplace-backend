import { Category } from "../../../infra/database/typeorm/market-place/entities/Category";

export interface CategoryRepositoryInterface {
  getAllCategories: () => Promise<Category[]>;
}
