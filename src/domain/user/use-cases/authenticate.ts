import { UserTypeormRepository } from "../../../infra/database/typeorm/market-place/repositories/user.repository";
import { RefreshTokenRepository } from "../../../infra/database/typeorm/market-place/repositories/refresh-token.repository";
import { compare } from "bcrypt";
import { AuthLoginRequest } from "../interfaces/authLoginRequest";
import { NotFoundError } from "../../../shared/errors/not-found.error";
import { UnauthenticatedError } from "../../../shared/errors/unauthenticated.error";
import { JWTService } from "../../../shared/services/jwt.service";

export class AuthenticateUseCase {
  private authRepository: UserTypeormRepository;
  private refreshTokenRepository: RefreshTokenRepository;
  private jwtService: JWTService;

  constructor() {
    this.authRepository = new UserTypeormRepository();
    this.refreshTokenRepository = new RefreshTokenRepository();
    this.jwtService = new JWTService();
  }

  async execute({ email, password }: AuthLoginRequest) {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError("Usuário não encontrado");
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
      throw new UnauthenticatedError("A senha está inválida!");
    }

    await this.refreshTokenRepository.revokeByUserId(user.id!);

    const { accessToken, refreshToken } = this.jwtService.generateTokenPair({
      id: user.id!,
      email: user.email,
    });

    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: user.id!,
      expiresAt: this.jwtService.getRefreshTokenExpiryDate(),
    });

    delete user.password;

    return {
      token: accessToken,
      refreshToken,
      user,
    };
  }
}
