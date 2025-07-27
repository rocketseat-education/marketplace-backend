import { FastifyReply, FastifyRequest } from "fastify";
import { CategoryRepository } from "../../../database/typeorm/market-place/repositories/category.repository";

export class FindProductCategoriesByIdController {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    const product = await this.categoryRepository.getAllCategories();
    reply.send(product);
  };
}
