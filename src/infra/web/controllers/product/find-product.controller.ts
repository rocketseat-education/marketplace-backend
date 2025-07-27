import { FastifyReply, FastifyRequest } from "fastify";
import { FindProductByIdUseCase } from "../../../../domain/product/use-case/find-product";

export class FindProductByIdController {
  private findProductLogic: FindProductByIdUseCase;

  constructor() {
    this.findProductLogic = new FindProductByIdUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const productId = parseInt(request.params.id);

    const product = await this.findProductLogic.execute(productId);
    reply.send(product);
  };
}
