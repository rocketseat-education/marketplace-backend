import { User } from "../entities/User";
import { CreditCard } from "../entities/CreditCard";
import {
  UserRepositoryInterface,
  CreateUserParams,
  UploadProfiePhotoParams,
  UpdateAvatarUrlParams,
  CreateCreditCardParams,
  UpdateCreditCardParams,
} from "../../../../../domain/user/repositoryInterface/user-repository.interface";
import { Repository } from "typeorm";
import { MarketPlaceDataSource } from "../data-source";
import { DatabaseError } from "../../../../../shared/errors/database.error";
import { UserAvatar } from "../entities/UserAvatar";

export class UserTypeormRepository implements UserRepositoryInterface {
  private userRepository: Repository<User>;
  private userAvatarRepository: Repository<UserAvatar>;
  private creditCardRepository: Repository<CreditCard>;

  constructor() {
    this.userRepository = MarketPlaceDataSource.getRepository(User);
    this.userAvatarRepository = MarketPlaceDataSource.getRepository(UserAvatar);
    this.creditCardRepository = MarketPlaceDataSource.getRepository(CreditCard);
  }

  async updateUserData(user: Partial<CreateUserParams>): Promise<User> {
    try {
      const userCreated = await this.userRepository.save(user);
      return userCreated;
    } catch (error) {
      throw new DatabaseError("Falha ao atualizar dados do usuário!", error);
    }
  }

  async updateUserAvatar(avatarUrl: UploadProfiePhotoParams): Promise<string> {
    try {
      const alredyExist = await this.userAvatarRepository.findOne({
        where: { userId: avatarUrl.userId },
      });

      const avatar = await this.userAvatarRepository.save({
        ...alredyExist,
        ...avatarUrl,
      });

      return avatar.url;
    } catch (error) {
      throw new DatabaseError(
        "Falha ao salvar foto de perfil do usuário!",
        error
      );
    }
  }

  async createUser(user: CreateUserParams): Promise<User> {
    try {
      const userCreated = await this.userRepository.save(user);
      return userCreated;
    } catch (error) {
      throw new DatabaseError("Falha ao criar o usuário!", error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email,
        },
        relations: ["avatar", "creditCards"],
      });
      return user;
    } catch (error) {
      throw new DatabaseError("Falha ao buscar usuário!", error);
    }
  }

  async createCreditCard(
    creditCard: CreateCreditCardParams
  ): Promise<CreditCard> {
    try {
      const creditCardCreated = await this.creditCardRepository.save(
        creditCard
      );
      return creditCardCreated;
    } catch (error) {
      throw new DatabaseError("Falha ao criar cartão de crédito!", error);
    }
  }

  async findCreditCardsByUserId(userId: number): Promise<CreditCard[]> {
    try {
      const creditCards = await this.creditCardRepository.find({
        where: { userId },
      });
      return creditCards;
    } catch (error) {
      throw new DatabaseError(
        "Falha ao buscar cartões de crédito do usuário!",
        error
      );
    }
  }

  async findCreditCardById(id: number): Promise<CreditCard> {
    try {
      const creditCard = await this.creditCardRepository.findOne({
        where: { id },
        relations: ["user"],
      });
      return creditCard;
    } catch (error) {
      throw new DatabaseError("Falha ao buscar cartão de crédito!", error);
    }
  }

  async updateCreditCard(params: UpdateCreditCardParams): Promise<CreditCard> {
    try {
      const { id, ...updateData } = params;
      await this.creditCardRepository.update(id, updateData);
      const updatedCreditCard = await this.findCreditCardById(id);
      return updatedCreditCard;
    } catch (error) {
      throw new DatabaseError("Falha ao atualizar cartão de crédito!", error);
    }
  }

  async deleteCreditCard(id: number): Promise<void> {
    try {
      await this.creditCardRepository.softDelete(id);
    } catch (error) {
      throw new DatabaseError("Falha ao deletar cartão de crédito!", error);
    }
  }
}
