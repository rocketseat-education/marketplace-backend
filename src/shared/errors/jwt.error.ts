import { UnauthenticatedError } from "./unauthenticated.error";

export enum JWTErrorType {
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  TOKEN_INVALID = "TOKEN_INVALID",
  TOKEN_MALFORMED = "TOKEN_MALFORMED",
  TOKEN_NOT_PROVIDED = "TOKEN_NOT_PROVIDED",
  TOKEN_FORMAT_INVALID = "TOKEN_FORMAT_INVALID",
  USER_NOT_FOUND = "USER_NOT_FOUND",
}

export class JWTError extends UnauthenticatedError {
  private errorType: JWTErrorType;

  constructor(message: string, errorType: JWTErrorType) {
    super(message);
    this.errorType = errorType;
  }

  public getErrorType() {
    return this.errorType;
  }
}
