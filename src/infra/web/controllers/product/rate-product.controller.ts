import { FastifyReply, FastifyRequest } from "fastify";
import { RateProduct } from "../../../../domain/product/interface/product-repository.interface";
import { RateProductUseCase } from "../../../../domain/product/use-case/rate-product";

export class RateProductController {
  private rateProductLogic: RateProductUseCase;

  constructor() {
    this.rateProductLogic = new RateProductUseCase();
  }

  execute = async (
    request: FastifyRequest<{ Body: RateProduct }>,
    reply: FastifyReply
  ) => {
    const params = request.body;

    const userId = request.user.id;

    await this.rateProductLogic.execute({ ...params, userId });

    reply.send({ message: "Produto avaliado com sucesso!" });
  };
}
