import { FastifyReply, FastifyRequest } from "fastify";
import { GetUserOrdersUseCase } from "../../../../domain/order/use-case/get-user-orders";
import { OrderRepository } from "../../../database/typeorm/market-place/repositories/order.repository";

export class GetUserOrdersController {
  private getUserOrdersUseCase: GetUserOrdersUseCase;

  constructor() {
    const orderRepository = new OrderRepository();
    this.getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository);
  }

  execute = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = request.user.id;
      const result = await this.getUserOrdersUseCase.execute(userId);

      reply.send(result);
    } catch (error) {
      throw error;
    }
  };
}
