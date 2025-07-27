import { DataSource, Repository } from "typeorm";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { products } from "./mocks/products.mock";
import { categories } from "./mocks/categories.mock";
import { User } from "../entities/User";
import { usersMock } from "./mocks/users.mock";
import { commentsMock } from "./mocks/comments.mock";
import { Mock } from "../entities/Mocks";
import { Rating } from "../entities/Rating";
import { Comment } from "../entities/Comment";
import { ratings } from "./mocks/ratings.mock";
import { UserAvatar } from "../entities/UserAvatar";
import { userAvatarsMock } from "./mocks/user-avatars.mock";

export class SeederService {
  private mockRepository: Repository<Mock>;

  constructor(private dataSource: DataSource) {
    this.mockRepository = dataSource.getRepository(Mock);
  }

  async run() {
    this.execute();
  }

  private async seedCategories() {
    const repository = this.dataSource.getRepository(Category);
    const checkMock = await this.mockRepository.findOne({
      where: {
        name: "categorys",
      },
    });

    if (!checkMock) {
      await Promise.all([
        await repository.save(categories),
        this.mockRepository.save({
          name: "categorys",
        }),
      ]);

      console.info("Categorias criadas com sucesso!");
    }
  }

  private async seedRatings() {
    const repository = this.dataSource.getRepository(Rating);

    const checkMock = await this.mockRepository.findOne({
      where: {
        name: "ratings",
      },
    });

    if (!checkMock) {
      await Promise.all([
        await repository.save(ratings),
        this.mockRepository.save({
          name: "ratings",
        }),
      ]);

      const productRepository = this.dataSource.getRepository(Product);

      const productsWithRating = await Promise.all(
        products.map(async (product) => {
          const productRatings = await repository.find({
            where: { productId: product.id },
          });

          const total = productRatings.reduce((sum, r) => sum + r.value, 0);

          const avg =
            productRatings.length > 0 ? total / productRatings.length : 0;
          const averageRating = parseFloat(avg.toFixed(1));

          return {
            ...product,
            averageRating,
            ratingCount: productRatings?.length,
          };
        })
      );

      await productRepository.save(productsWithRating);

      console.info("Avaliações criados com sucesso!");
    }
  }

  private async seedProducts() {
    const repository = this.dataSource.getRepository(Product);
    const checkMock = await this.mockRepository.findOne({
      where: {
        name: "products",
      },
    });

    if (!checkMock) {
      await Promise.all([
        await repository.save(products),
        this.mockRepository.save({
          name: "products",
        }),
      ]);
      console.info("Produtos criados com sucesso!");
    }
  }

  private async seedUsers() {
    const repository = this.dataSource.getRepository(User);

    const checkMock = await this.mockRepository.findOne({
      where: {
        name: "users",
      },
    });

    if (!checkMock) {
      await Promise.all([
        await repository.save(usersMock),
        this.mockRepository.save({
          name: "users",
        }),
      ]);

      const userAvatarRepository = await this.dataSource.getRepository(
        UserAvatar
      );

      await userAvatarRepository.save(userAvatarsMock);

      await console.info("Usuários criados com sucesso!");
    }
  }

  private async seedComments() {
    const repository = this.dataSource.getRepository(Comment);
    const checkMock = await this.mockRepository.findOne({
      where: {
        name: "comments",
      },
    });

    if (!checkMock) {
      await Promise.all([
        await repository.save(commentsMock),
        this.mockRepository.save({
          name: "comments",
        }),
      ]);
      console.info("Comentários criados com sucesso!");
    }
  }

  private async execute() {
    await Promise.all([this.seedUsers(), this.seedCategories()]);
    await this.seedProducts();
    await this.seedRatings();
    await this.seedComments();
  }
}
