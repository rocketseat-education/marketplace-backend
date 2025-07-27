import { OrderRepositoryInterface } from "../interface/order-repository.interface";
import { ProductRepositoryInterface } from "../../product/interface/product-repository.interface";
import { BusinessError } from "../../../shared/errors/business.error";

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  userId: number;
  creditCardId: number;
  items: CreateOrderItemRequest[];
}

export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepositoryInterface,
    private productRepository: ProductRepositoryInterface
  ) {}

  async execute({ userId, creditCardId, items }: CreateOrderRequest) {
    if (!items || items.length === 0) {
      throw new BusinessError(
        "É necessário informar pelo menos um item no pedido",
        400
      );
    }

    const ordersToCreate = [];

    for (const item of items) {
      if (item.quantity <= 0) {
        throw new BusinessError("A quantidade deve ser maior que zero", 400);
      }

      const product = await this.productRepository.findById(item.productId);

      if (!product) {
        throw new BusinessError(
          `Produto com ID ${item.productId} não encontrado`,
          1003
        );
      }

      const productValue = parseFloat(product.value);
      const totalPrice = productValue * item.quantity;

      ordersToCreate.push({
        userId,
        creditCardId,
        productId: item.productId,
        quantity: item.quantity,
        totalPrice,
      });
    }

    const orders = await this.orderRepository.createMultipleOrders(
      ordersToCreate
    );

    return {
      message: "Pedido criado com sucesso",
      ordersCount: orders.length,
      orders: orders.map((order) => ({
        id: order.id,
        productId: order.productId,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
      })),
    };
  }
}
