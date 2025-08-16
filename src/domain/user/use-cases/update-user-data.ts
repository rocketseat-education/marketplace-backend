import { UpdateUserParams } from "../repositoryInterface/user-repository.interface";
import { NotFoundError } from "../../../shared/errors/not-found.error";
import { compare } from "bcrypt";
import { UnauthenticatedError } from "../../../shared/errors/unauthenticated.error";
import { hashSync } from "bcrypt";
import { UserTypeormRepository } from "../../../infra/database/typeorm/market-place/repositories/user.repository";
import { User } from "../../../infra/database/typeorm/market-place/entities/User";

export class UpdateUserDataUseCase {
  private userRepository: UserTypeormRepository;

  constructor() {
    this.userRepository = new UserTypeormRepository();
  }

  async execute(
    userData: Partial<UpdateUserParams>,
    email: string
  ): Promise<User> {
    const userExist = await this.userRepository.findByEmail(email);

    if (!userExist) {
      throw new NotFoundError("Usuário não encontrado");
    }

    if (userData?.password && userData?.newPassword) {
      const { password, newPassword } = userData;

      const checkPassword = await compare(password, userExist.password);

      if (!checkPassword) {
        throw new UnauthenticatedError("A senha está inválida!");
      }

      const encryptedPassword = hashSync(newPassword, 10);
      userData.password = encryptedPassword;
    } else {
      userData.password = userExist.password;
    }

    delete userData.newPassword;
    const user = await this.userRepository.updateUserData({
      ...userData,
      id: userExist.id,
    });

    delete user.password;

    return user;
  }
}
