import { FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { UserTypeormRepository } from "../../database/typeorm/market-place/repositories/user.repository";
import { UnauthenticatedError } from "../../../shared/errors/unauthenticated.error";
import { JWTService } from "../../../shared/services/jwt.service";
import { JWTError, JWTErrorType } from "../../../shared/errors/jwt.error";

export class CheckAuthtenticationMiddleware {
  private authRepository: UserTypeormRepository;
  private jwtService: JWTService;

  constructor() {
    this.authRepository = new UserTypeormRepository();
    this.jwtService = new JWTService();
  }

  execute = async (request: FastifyRequest) => {
    const authorizationHeader = request.headers?.authorization;
    if (!authorizationHeader) {
      throw new JWTError(
        "Token de autorização não fornecido",
        JWTErrorType.TOKEN_NOT_PROVIDED
      );
    }

    const [bearer, token] = authorizationHeader.split(" ");

    if (bearer !== "Bearer") {
      throw new JWTError(
        "Formato de token inválido. Use: Bearer <token>",
        JWTErrorType.TOKEN_FORMAT_INVALID
      );
    }

    if (!token || token === "") {
      throw new JWTError(
        "Token não fornecido",
        JWTErrorType.TOKEN_NOT_PROVIDED
      );
    }

    try {
      const payload = this.jwtService.verifyAccessToken(token);

      const user = await this.authRepository.findByEmail(payload.email);

      if (!user) {
        throw new JWTError(
          "Usuário não encontrado",
          JWTErrorType.USER_NOT_FOUND
        );
      }

      request.user = user;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new JWTError("Token expirado", JWTErrorType.TOKEN_EXPIRED);
      }

      if (error instanceof jwt.JsonWebTokenError) {
        throw new JWTError("Token inválido", JWTErrorType.TOKEN_INVALID);
      }

      if (error instanceof jwt.NotBeforeError) {
        throw new JWTError(
          "Token ainda não é válido",
          JWTErrorType.TOKEN_INVALID
        );
      }

      if (error instanceof JWTError) {
        throw error;
      }

      if (error instanceof UnauthenticatedError) {
        throw error;
      }

      throw new JWTError("Falha na autenticação", JWTErrorType.TOKEN_INVALID);
    }
  };
}
