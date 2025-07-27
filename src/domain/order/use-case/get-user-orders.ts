import { OrderRepositoryInterface } from "../interface/order-repository.interface";

export class GetUserOrdersUseCase {
  constructor(private orderRepository: OrderRepositoryInterface) {}

  async execute(userId: number) {
    const orders = await this.orderRepository.findOrdersByUserId(userId);

    return {
      orders: orders.map((order) => ({
        id: order.id,
        productId: order.productId,
        productName: order.product?.name,
        productPhoto: order.product?.photo,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        creditCard: {
          id: order.creditCard?.id,
          maskedNumber: order.creditCard?.number
            ? `****-****-****-${order.creditCard.number.slice(-4)}`
            : undefined,
        },
      })),
      totalOrders: orders.length,
    };
  }
}
