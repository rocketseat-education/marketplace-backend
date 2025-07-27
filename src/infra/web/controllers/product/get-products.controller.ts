import { FastifyReply, FastifyRequest } from "fastify";
import { GetProductsUseCase } from "../../../../domain/product/use-case/get-products";
import { GetProductsParams } from "../../../../domain/product/interface/product-repository.interface";

export class GetProductsController {
  private getProductsLogic: GetProductsUseCase;

  constructor() {
    this.getProductsLogic = new GetProductsUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Body: GetProductsParams }>,
    reply: FastifyReply
  ) => {
    const params = request.body;

    const products = await this.getProductsLogic.execute(params);

    reply.send(products);
  };
}
