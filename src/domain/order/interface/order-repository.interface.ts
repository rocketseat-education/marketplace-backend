import { Order } from "../../../infra/database/typeorm/market-place/entities/Order";

export interface CreateOrderRequest {
  userId: number;
  creditCardId: number;
  productId: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderRepositoryInterface {
  createOrder(data: CreateOrderRequest): Promise<Order>;
  createMultipleOrders(orders: CreateOrderRequest[]): Promise<Order[]>;
  findOrdersByUserId(userId: number): Promise<Order[]>;
}
