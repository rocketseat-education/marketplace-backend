import { MarketPlaceDataSource } from "../data-source";
import { CategoryRepositoryInterface } from "../../../../../domain/product/interface/category-repository.interface";
import { Category } from "../entities/Category";
import { Repository } from "typeorm";
import { DatabaseError } from "../../../../../shared/errors/database.error";

export class CategoryRepository implements CategoryRepositoryInterface {
  categoryRepository: Repository<Category>;
  constructor() {
    this.categoryRepository = MarketPlaceDataSource.getRepository(Category);
  }
  async getAllCategories(): Promise<Category[]> {
    try {
      const categories = await this.categoryRepository.find();
      return categories;
    } catch (error) {
      throw new DatabaseError("Falha ao buscar categorias", error);
    }
  }
}
