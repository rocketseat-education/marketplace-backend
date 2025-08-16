import { Brackets, Repository } from "typeorm";

import { DatabaseError } from "../../../../../shared/errors/database.error";
import { Paginated } from "../../../../../interfaces/paginated";
import { NotFoundError } from "../../../../../shared/errors/not-found.error";
import { Product } from "../entities/Product";
import {
  CreateComment,
  GetCommentsParams,
  GetProductsParams,
  GetUserRating,
  GetUserComment,
  UpdateComment,
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

  async findUserRating({ productId, userId }: GetUserRating): Promise<Rating> {
    try {
      const rating = await this.ratingRepository.findOne({
        where: {
          productId,
          userId,
        },
      });
      return rating;
    } catch (error) {
      throw new DatabaseError("Falha ao criar comentário", error);
    }
  }

  async createComment(comment: CreateComment): Promise<void> {
    try {
      await this.commentRepository.save(comment);
    } catch (error) {
      throw new DatabaseError("Falha ao criar comentário", error);
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

      const ratingCreated = await this.ratingRepository.save({
        ...userAlredyRate,
        value,
        userId,
        productId,
      });

      const ratings = await this.ratingRepository.find({
        where: {
          productId,
        },
      });

      const total = ratings.reduce((sum, curr) => sum + curr.value, 0);

      const avg = ratings.length > 0 ? total / ratings.length : 0;
      const averageRating = parseFloat(avg.toFixed(1));

      await this.productRepository.update(
        { id: productId },
        {
          averageRating,
          ratingCount: ratings.length,
        }
      );
    } catch (error) {
      throw new DatabaseError("Falha ao avaliar produto", error);
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
        .leftJoinAndSelect("user.avatar", "avatar")
        .leftJoinAndSelect(
          "user.ratings",
          "ratings",
          "ratings.productId = :productId"
        )
        .select([
          "comment.id",
          "comment.content",
          "comment.productId",
          "comment.createdAt",
          "user.id",
          "user.name",
          "user.email",
          "ratings.id",
          "ratings.value",
          "ratings.productId",
          "ratings.userId",
          "avatar.url",
        ])
        .where("comment.productId = :productId", { productId })
        .orderBy("comment.createdAt", "DESC");

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
      throw new DatabaseError("Falha ao buscar comentários do produto", error);
    }
  }

  async findById(id: number): Promise<Product> {
    try {
      const transaction = await this.productRepository.findOne({
        where: { id },
        relations: ["category"],
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
    pagination,
    filters,
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
          "product.id",
          "product.name",
          "product.categoryId",
          "product.value",
          "product.averageRating",
          "product.createdAt",
          "product.ratingCount",
          "product.photo",
          "category.id",
          "category.name",
        ]);

      if (sort?.averageRating) {
        query.addOrderBy(
          "product.averageRating",
          sort.averageRating.toUpperCase() as "ASC" | "DESC"
        );
      } else {
        query.addOrderBy("product.createdAt", "DESC");
      }

      if (filters?.searchText) {
        query.andWhere(
          new Brackets((qb) => {
            qb.orWhere("product.name LIKE :searchText", {
              searchText: `%${filters.searchText}%`,
            })
              .orWhere("category.name LIKE :searchText", {
                searchText: `%${filters.searchText}%`,
              })
              .orWhere("product.description LIKE :searchText", {
                searchText: `%${filters.searchText}%`,
              })
              .orWhere("CAST(product.value AS TEXT) LIKE :searchText", {
                searchText: `%${filters.searchText}%`,
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
        query.andWhere("product.categoryId IN (:...categoryIds)", {
          categoryIds: filters.categoryIds,
        });
      }

      if (filters?.minValue !== undefined) {
        query.andWhere("CAST(product.value AS REAL) >= :minValue", {
          minValue: filters.minValue,
        });
      }

      if (filters?.maxValue !== undefined) {
        query.andWhere("CAST(product.value AS REAL) <= :maxValue", {
          maxValue: filters.maxValue,
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
      throw new DatabaseError("Falha ao buscar produtos", error);
    }
  }

  async findUserComment({
    productId,
    userId,
  }: GetUserComment): Promise<Comment | null> {
    try {
      const comment = await this.commentRepository.findOne({
        where: {
          productId,
          userId,
        },
        relations: ["user"],
      });
      return comment;
    } catch (error) {
      throw new DatabaseError("Falha ao buscar comentário do usuário", error);
    }
  }

  async updateComment({
    commentId,
    content,
    userId,
    rating,
  }: UpdateComment): Promise<Comment> {
    try {
      const existingComment = await this.commentRepository.findOne({
        where: { id: commentId, userId },
        relations: ["user"],
      });

      if (!existingComment) {
        throw new NotFoundError(
          "Comentário não encontrado ou não pertence ao usuário"
        );
      }

      await this.commentRepository.update(commentId, { content });

      if (rating !== undefined) {
        await this.rateProdct({
          userId,
          productId: existingComment.productId,
          value: rating,
        });
      }

      const updatedComment = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ["user"],
      });

      return updatedComment!;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError("Falha ao atualizar comentário", error);
    }
  }
}
