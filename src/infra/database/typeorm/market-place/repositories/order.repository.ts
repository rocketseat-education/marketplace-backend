import { Repository } from "typeorm";
import { MarketPlaceDataSource } from "../data-source";
import { Order } from "../entities/Order";
import {
  CreateOrderRequest,
  OrderRepositoryInterface,
} from "../../../../../domain/order/interface/order-repository.interface";
import { DatabaseError } from "../../../../../shared/errors/database.error";

export class OrderRepository implements OrderRepositoryInterface {
  private repository: Repository<Order>;

  constructor() {
    this.repository = MarketPlaceDataSource.getRepository(Order);
  }

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    try {
      const order = this.repository.create(data);
      return await this.repository.save(order);
    } catch (error) {
      throw new DatabaseError("Falha ao criar pedido", error);
    }
  }

  async createMultipleOrders(orders: CreateOrderRequest[]): Promise<Order[]> {
    try {
      const orderEntities = this.repository.create(orders);
      return await this.repository.save(orderEntities);
    } catch (error) {
      throw new DatabaseError("Falha ao criar pedidos", error);
    }
  }

  async findOrdersByUserId(userId: number): Promise<Order[]> {
    try {
      return await this.repository.find({
        where: { userId },
        relations: ["product", "creditCard"],
        order: { createdAt: "DESC" },
      });
    } catch (error) {
      throw new DatabaseError("Falha ao buscar pedidos do usuário", error);
    }
  }
}
