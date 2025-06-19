import { Brackets, Repository } from "typeorm";
import { Transaction } from "../entities/Transaction";
import { DtMoneyDataSource } from "../data-source";
import {
  CreateTranscationParams,
  GetTransactionsParams,
  TransactionRepositoryInterface,
  TransactionTotalResponse,
  UpdateTransactionParams,
} from "../../../../../domain/transaction/repositoryInterface/transaction-repository.interface";
import { DatabaseError } from "../../../../../shared/errors/database.error";
import { Paginated } from "../../../../../interfaces/paginated";
import { NotFoundError } from "../../../../../shared/errors/not-found.error";

export class TransactionRepository implements TransactionRepositoryInterface {
  private transactionRepository: Repository<Transaction>;

  constructor() {
    this.transactionRepository = DtMoneyDataSource.getRepository(Transaction);
  }

  async createTransaction(
    params: CreateTranscationParams
  ): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.save(params);
      return transaction;
    } catch (error) {
      throw new DatabaseError("Falha ao criar transação", error);
    }
  }

  async deleteTransaction(transactionId: number): Promise<void> {
    try {
      await this.transactionRepository.softDelete(transactionId);
    } catch (error) {
      throw new DatabaseError("Falha ao excluir a transação", error);
    }
  }

  async findById(id: number): Promise<Transaction> {
    try {
      const transaction = await this.transactionRepository.findOne({
        where: { id },
      });

      if (!transaction) {
        throw new NotFoundError(`Transação com ID ${id} não encontrada`);
      }

      return transaction;
    } catch (error) {
      throw new DatabaseError("Falha ao buscar a transação por ID", error);
    }
  }

  async updateTransaction(params: UpdateTransactionParams): Promise<void> {
    try {
      await this.transactionRepository.save(params);
    } catch (error) {
      throw new DatabaseError("Falha ao atualizar a transação", error);
    }
  }

  async getTransactionTotals({
    userId,
    filters,
    searchText,
  }: GetTransactionsParams): Promise<TransactionTotalResponse> {
    try {
      const query = this.transactionRepository
        .createQueryBuilder("transaction")
        .leftJoinAndSelect("transaction.type", "type")
        .leftJoinAndSelect("transaction.category", "category")
        .select([
          "COALESCE(SUM(CASE WHEN transaction.typeId = 1 THEN transaction.value ELSE 0 END), 0) AS totalRevenue",
          "COALESCE(SUM(CASE WHEN transaction.typeId = 2 THEN transaction.value ELSE 0 END), 0) AS totalExpense",
          "COALESCE(SUM(CASE WHEN transaction.typeId = 1 THEN transaction.value ELSE 0 END), 0) - COALESCE(SUM(CASE WHEN transaction.typeId = 2 THEN transaction.value ELSE 0 END), 0) AS total",
        ])
        .where("transaction.userId = :userId", { userId });
      if (filters?.from) {
        query.andWhere("transaction.createdAt >= :from", {
          from: filters.from,
        });
      }

      if (filters?.to) {
        query.andWhere("transaction.createdAt <= :to", {
          to: filters.to,
        });
      }

      if (filters?.categoryIds?.length) {
        query.andWhere("category.id IN (:...categoryIds)", {
          categoryIds: filters.categoryIds,
        });
      }

      if (filters?.typeId) {
        query.andWhere("transaction.typeId = :typeId", {
          typeId: filters.typeId,
        });
      }

      if (searchText) {
        query.andWhere(
          new Brackets((qb) => {
            qb.orWhere("transaction.value LIKE :searchText", {
              searchText: `%${searchText}%`,
            })
              .orWhere("type.name LIKE :searchText", {
                searchText: `%${searchText}%`,
              })
              .orWhere("category.name LIKE :searchText", {
                searchText: `%${searchText}%`,
              })
              .orWhere("transaction.description LIKE :searchText", {
                searchText: `%${searchText}%`,
              });
          })
        );
      }

      const result = await query.getRawOne();

      return {
        revenue: Number(result.totalRevenue),
        expense: Number(result.totalExpense),
        total: Number(result.total),
      };
    } catch (error) {
      throw new DatabaseError("Falha ao calcular totais das transações", error);
    }
  }

  async getTransactions({
    userId,
    pagination,
    filters,
    searchText,
    sort,
  }: GetTransactionsParams): Promise<Paginated<Transaction>> {
    try {
      let totalRows = 0;
      let totalPages = 0;
      let page = 0;
      let perPage = 0;
      let transactions: Transaction[] = [];

      const query = this.transactionRepository
        .createQueryBuilder("transaction")
        .leftJoinAndSelect("transaction.type", "type")
        .leftJoinAndSelect("transaction.category", "category");

      if (sort?.id) {
        query.addOrderBy(
          "transaction.id",
          sort.id.toUpperCase() as "ASC" | "DESC"
        );
      } else {
        query.addOrderBy("transaction.id", "DESC");
      }

      query.where("transaction.userId = :userId", { userId });

      if (searchText) {
        query.andWhere(
          new Brackets((qb) => {
            qb.orWhere("transaction.value LIKE :searchText", {
              searchText: `%${searchText}%`,
            })
              .orWhere("type.name LIKE :searchText", {
                searchText: `%${searchText}%`,
              })
              .orWhere("category.name LIKE :searchText", {
                searchText: `%${searchText}%`,
              })
              .orWhere("transaction.description LIKE :searchText", {
                searchText: `%${searchText}%`,
              });
          })
        );
      }

      if (filters?.from) {
        query.andWhere("transaction.createdAt >= :from", {
          from: filters.from,
        });
      }

      if (filters?.to) {
        query.andWhere("transaction.createdAt <= :to", {
          to: filters.to,
        });
      }

      if (filters?.to && !filters.from) {
        query.andWhere("transaction.createdAt >= :to", { to: filters.to });
      }

      if (filters?.categoryIds?.length) {
        query.andWhere("category.id IN (:...categoryIds)", {
          categoryIds: filters.categoryIds,
        });
      }

      if (filters?.typeId) {
        query.andWhere("type.id = :typeId", {
          typeId: filters.typeId,
        });
      }

      if (pagination) {
        const skip = (pagination.page - 1) * pagination.perPage;
        const take = pagination.perPage;

        query.skip(skip).take(take);

        const result = await query.getManyAndCount();

        transactions = result[0];
        totalRows = result[1];
        totalPages = Math.ceil(totalRows / pagination.perPage);
        page = pagination.page;
        perPage = pagination.perPage;
      } else {
        transactions = await query.getMany();
      }
      return {
        data: transactions,
        totalRows,
        totalPages,
        page,
        perPage,
      };
    } catch (error) {
      throw new DatabaseError("Falha ao buscar transações finançeiras", error);
    }
  }
}
