import { FastifyReply, FastifyRequest } from "fastify";
import { CreateOrderUseCase } from "../../../../domain/order/use-case/create-order";
import { ProductRepository } from "../../../database/typeorm/market-place/repositories/product.repository";
import { OrderRepository } from "../../../database/typeorm/market-place/repositories/order.repository";

interface CreateOrderBody {
  creditCardId: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export class CreateOrderController {
  private createOrderUseCase: CreateOrderUseCase;

  constructor() {
    const orderRepository = new OrderRepository();
    const productRepository = new ProductRepository();
    this.createOrderUseCase = new CreateOrderUseCase(
      orderRepository,
      productRepository
    );
  }

  execute = async (
    request: FastifyRequest<{ Body: CreateOrderBody }>,
    reply: FastifyReply
  ) => {
    const { creditCardId, items } = request.body;
    const userId = request.user.id;

    const result = await this.createOrderUseCase.execute({
      userId,
      creditCardId,
      items,
    });

    reply.send(result);
  };
}
