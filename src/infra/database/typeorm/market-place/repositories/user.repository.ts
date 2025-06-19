import { User } from "../entities/User";
import {
  UserRepositoryInterface,
  CreateUserParams,
  UploadProfiePhotoParams,
} from "../../../../../domain/user/repositoryInterface/user-repository.interface";
import { Repository } from "typeorm";
import { MarketPlaceDataSource } from "../data-source";
import { DatabaseError } from "../../../../../shared/errors/database.error";

export class UserTypeormRepository implements UserRepositoryInterface {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = MarketPlaceDataSource.getRepository(User);
  }
  async uploadProfilePhoto({
    url,
    userId,
  }: UploadProfiePhotoParams): Promise<string> {
    try {
      await this.userRepository.update({ id: userId }, { photo: url });
      return url;
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
      });
      return user;
    } catch (error) {
      throw new DatabaseError("Falha ao buscar isiário!", error);
    }
  }
}
