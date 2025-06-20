import { Brackets, Repository } from "typeorm";

import { DatabaseError } from "../../../../../shared/errors/database.error";
import { Paginated } from "../../../../../interfaces/paginated";
import { NotFoundError } from "../../../../../shared/errors/not-found.error";
import { Product } from "../entities/Product";
import {
  CreateComment,
  GetCommentsParams,
  GetProductsParams,
  ProductRepositoryInterface,
  RateProduct,
} from "../../../../../domain/product/interface/product-repository.interface";
import { MarketPlaceDataSource } from "../data-source";
import { Comment } from "../entities/Comment";
import { Rating } from "../entities/Rating";

export class ProductRepository implements ProductRepositoryInterface {
  private productRepository: Repository<Product>;
  private commentRepository: Repository<Comment>;
  private ratingRepository: Repository<Rating>;

  constructor() {
    this.productRepository = MarketPlaceDataSource.getRepository(Product);
    this.commentRepository = MarketPlaceDataSource.getRepository(Comment);
    this.ratingRepository = MarketPlaceDataSource.getRepository(Rating);
  }
  async createComment(comment: CreateComment): Promise<void> {
    try {
      await this.commentRepository.save(comment);
    } catch (error) {
      throw new DatabaseError("Falha ao criar comentário");
    }
  }

  async rateProdct({ productId, userId, value }: RateProduct): Promise<void> {
    try {
      const userAlredyRate = await this.ratingRepository.findOne({
        where: {
          userId,
          productId,
        },
      });

      await this.ratingRepository.save({
        ...userAlredyRate,
        value,
        userId,
        productId,
      });

      return;
    } catch (error) {
      throw new DatabaseError("Falha ao avaliar produto");
    }
  }

  async getComments({
    productId,
    pagination,
  }: GetCommentsParams): Promise<Paginated<Comment>> {
    try {
      let totalRows = 0;
      let totalPages = 0;
      let page = 0;
      let perPage = 0;
      let comments: Comment[] = [];

      const query = this.commentRepository
        .createQueryBuilder("comment")
        .leftJoinAndSelect("comment.user", "user")
        .select([
          "comment.content",
          "comment.productId",
          "comment.userId",
          "comment.user",
          "user.name",
          "user.photo",
          "user.email",
        ]);

      query.where("comment.productId = :productId", { productId });

      if (pagination) {
        const skip = (pagination.page - 1) * pagination.perPage;
        const take = pagination.perPage;

        query.skip(skip).take(take);

        const result = await query.getManyAndCount();

        comments = result[0];
        totalRows = result[1];
        totalPages = Math.ceil(totalRows / pagination.perPage);
        page = pagination.page;
        perPage = pagination.perPage;
      } else {
        comments = await query.getMany();
      }
      return {
        data: comments,
        totalRows,
        totalPages,
        page,
        perPage,
      };
    } catch (error) {
      throw new DatabaseError("Falha ao buscar comentários do produto");
    }
  }

  async findById(id: number): Promise<Product> {
    try {
      const transaction = await this.productRepository.findOne({
        where: { id },
      });

      if (!transaction) {
        throw new NotFoundError(`Produto com ID ${id} não encontrada`);
      }

      return transaction;
    } catch (error) {
      throw new DatabaseError("Falha ao buscar o Produto por ID", error);
    }
  }

  async getProducts({
    productId,
    pagination,
    filters,
    searchText,
    sort,
  }: GetProductsParams): Promise<Paginated<Product>> {
    try {
      let totalRows = 0;
      let totalPages = 0;
      let page = 0;
      let perPage = 0;
      let products: Product[] = [];

      const query = this.productRepository
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.category", "category")
        .select([
          "product.category",
          "product.name",
          "product.categoryId",
          "product.value",
          "product.photo",
          "product.averageRating",
          "product.createdAt",
          "product.ratingCount",
          "category.name",
        ]);

      query.where("product = :productId", { productId });

      if (sort?.averageRating) {
        query.addOrderBy(
          "product.averageRating",
          sort.averageRating.toUpperCase() as "ASC" | "DESC"
        );
      } else {
        query.addOrderBy("product.createdAt", "DESC");
      }

      if (searchText) {
        query.andWhere(
          new Brackets((qb) => {
            qb.orWhere("product.value LIKE :searchText", {
              searchText: `%${searchText}%`,
            })
              .orWhere("category.name LIKE :searchText", {
                searchText: `%${searchText}%`,
              })
              .orWhere("product.description LIKE :searchText", {
                searchText: `%${searchText}%`,
              })
              .orWhere("product.value LIKE :searchText", {
                searchText: `%${searchText}%`,
              });
          })
        );
      }

      if (filters?.from) {
        query.andWhere("product.createdAt >= :from", {
          from: filters.from,
        });
      }

      if (filters?.to) {
        query.andWhere("product.createdAt <= :to", {
          to: filters.to,
        });
      }

      if (filters?.to && !filters.from) {
        query.andWhere("product.createdAt >= :to", { to: filters.to });
      }

      if (filters?.categoryIds?.length) {
        query.andWhere("category.id IN (:...categoryIds)", {
          categoryIds: filters.categoryIds,
        });
      }

      if (pagination) {
        const skip = (pagination.page - 1) * pagination.perPage;
        const take = pagination.perPage;

        query.skip(skip).take(take);

        const result = await query.getManyAndCount();

        products = result[0];
        totalRows = result[1];
        totalPages = Math.ceil(totalRows / pagination.perPage);
        page = pagination.page;
        perPage = pagination.perPage;
      } else {
        products = await query.getMany();
      }
      return {
        data: products,
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
