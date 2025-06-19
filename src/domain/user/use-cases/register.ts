import { UserTypeormRepository } from "../../../infra/database/typeorm/market-place/repositories/user.repository";
import { CreateUserParams } from "../repositoryInterface/user-repository.interface";
import { hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { AuthReponse } from "../interfaces/authResponse";
import { UnauthenticatedError } from "../../../shared/errors/unauthenticated.error";

export class RegisterUseCase {
  private authRepository: UserTypeormRepository;

  constructor() {
    this.authRepository = new UserTypeormRepository();
  }

  async execute(user: CreateUserParams): Promise<AuthReponse> {
    const userAlredyExists = await this.authRepository.findByEmail(user.email);

    if (userAlredyExists) {
      throw new UnauthenticatedError("O E-mail já está cadastrado!");
    }

    const encryptedPassword = hashSync(user.password, 10);

    const userCreated = await this.authRepository.createUser({
      ...user,
      password: encryptedPassword,
    });

    const token = sign(
      {
        id: userCreated.id,
        email: userCreated.email,
      },
      process.env.APP_SCRETET_KEY,
      {
        expiresIn: "365d",
        algorithm: "HS256",
      }
    );

    delete userCreated.password;

    return {
      token,
      user: userCreated,
    };
  }
}
