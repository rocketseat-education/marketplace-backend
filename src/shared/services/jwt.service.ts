import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

interface JWTPayload {
  id: number;
  email: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiry: string;
  private readonly refreshTokenExpiry: string;

  constructor() {
    this.accessTokenSecret = process.env.JWT_SECRET || "default-secret";
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET || "default-refresh-secret";
    this.accessTokenExpiry = process.env.JWT_EXPIRY || "15m";
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || "7d";
  }

  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
    });
  }

  generateRefreshToken(): string {
    return randomBytes(64).toString("hex");
  }

  generateTokenPair(payload: JWTPayload): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(),
    };
  }

  verifyAccessToken(token: string): JWTPayload {
    return jwt.verify(token, this.accessTokenSecret) as JWTPayload;
  }

  getRefreshTokenExpiryDate(): Date {
    const now = new Date();
    const expiryDays = parseInt(this.refreshTokenExpiry.replace("d", "")) || 7;
    return new Date(now.getTime() + expiryDays * 24 * 60 * 60 * 1000);
  }

  isRefreshTokenValid(expiresAt: Date): boolean {
    return new Date() < expiresAt;
  }
}
