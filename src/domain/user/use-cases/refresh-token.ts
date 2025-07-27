import { RefreshTokenRepository } from "../../../infra/database/typeorm/market-place/repositories/refresh-token.repository";
import { JWTService } from "../../../shared/services/jwt.service";
import { UnauthenticatedError } from "../../../shared/errors/unauthenticated.error";
import { NotFoundError } from "../../../shared/errors/not-found.error";

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  private refreshTokenRepository: RefreshTokenRepository;
  private jwtService: JWTService;

  constructor() {
    this.refreshTokenRepository = new RefreshTokenRepository();
    this.jwtService = new JWTService();
  }

  async execute({
    refreshToken,
  }: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const storedRefreshToken = await this.refreshTokenRepository.findByToken(
      refreshToken
    );

    if (!storedRefreshToken) {
      throw new NotFoundError("Refresh token não encontrado");
    }

    if (storedRefreshToken.isRevoked) {
      throw new UnauthenticatedError("Refresh token foi revogado");
    }

    if (!this.jwtService.isRefreshTokenValid(storedRefreshToken.expiresAt)) {
      await this.refreshTokenRepository.revokeByToken(refreshToken);
      throw new UnauthenticatedError("Refresh token expirou");
    }

    await this.refreshTokenRepository.revokeByToken(refreshToken);

    const { accessToken, refreshToken: newRefreshToken } =
      this.jwtService.generateTokenPair({
        id: storedRefreshToken.user.id!,
        email: storedRefreshToken.user.email,
      });

    await this.refreshTokenRepository.create({
      token: newRefreshToken,
      userId: storedRefreshToken.user.id!,
      expiresAt: this.jwtService.getRefreshTokenExpiryDate(),
    });

    return {
      token: accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
