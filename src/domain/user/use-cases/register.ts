import { UserTypeormRepository } from "../../../infra/database/typeorm/market-place/repositories/user.repository";
import { RefreshTokenRepository } from "../../../infra/database/typeorm/market-place/repositories/refresh-token.repository";
import { CreateUserParams } from "../repositoryInterface/user-repository.interface";
import { hashSync } from "bcrypt";
import { AuthReponse } from "../interfaces/authResponse";
import { UnauthenticatedError } from "../../../shared/errors/unauthenticated.error";
import { JWTService } from "../../../shared/services/jwt.service";

export class RegisterUseCase {
  private authRepository: UserTypeormRepository;
  private refreshTokenRepository: RefreshTokenRepository;
  private jwtService: JWTService;

  constructor() {
    this.authRepository = new UserTypeormRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
    this.jwtService = new JWTService();
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

    const { accessToken, refreshToken } = this.jwtService.generateTokenPair({
      id: userCreated.id!,
      email: userCreated.email,
    });

    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: userCreated.id!,
      expiresAt: this.jwtService.getRefreshTokenExpiryDate(),
    });

    delete userCreated.password;

    return {
      token: accessToken,
      refreshToken,
      user: userCreated,
    };
  }
}
