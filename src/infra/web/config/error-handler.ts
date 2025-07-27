import { FastifyInstance } from "fastify";
import { AppError } from "../../../shared/errors/app.error";
import { HttpError } from "../../../shared/errors/http.error";
import { BusinessError } from "../../../shared/errors/business.error";
import { UnauthenticatedError } from "../../../shared/errors/unauthenticated.error";
import { ForbiddenError } from "../../../shared/errors/forbidden.error";
import { UnprocessedEntityError } from "../../../shared/errors/unprocessed-entity.error";
import { NotFoundError } from "../../../shared/errors/not-found.error";
import { DatabaseError } from "../../../shared/errors/database.error";
import { JWTError } from "../../../shared/errors/jwt.error";

export const configure = (fastify: FastifyInstance) => {
  fastify.setErrorHandler((error, request, reply) => {
    if (
      (error instanceof AppError && error.getShouldPrintInConsole()) ||
      !(error instanceof AppError)
    ) {
      console.error("", error);
    }

    if (error instanceof HttpError) {
      return reply.status(error.statusCode).send({
        message: error.message,
      });
    }

    if (error instanceof BusinessError) {
      return reply.status(400).send({
        message: error.message,
        internalErrorCode: error.getAppInternalCode(),
      });
    }

    if (error instanceof JWTError) {
      return reply.status(401).send({
        message: error.message,
        errorType: error.getErrorType(),
        code: "JWT_ERROR",
      });
    }

    if (error instanceof UnauthenticatedError) {
      return reply.status(401).send({
        message: error.message,
      });
    }

    if (error instanceof ForbiddenError) {
      return reply.status(403).send({
        message: error.message,
      });
    }

    if (error instanceof NotFoundError) {
      return reply.status(404).send({
        message: error.message,
      });
    }

    if (error instanceof DatabaseError) {
      return reply.status(500).send({
        message: error.message,
      });
    }

    if (error instanceof UnprocessedEntityError) {
      return reply.status(error.getStatusCode()).send({
        message: error.message,
        errors: error.getErrors(),
      });
    }

    if (error.validation) {
      const messages = error.validation.map((e) => e.message);

      return reply.status(422).send({
        message: "Validation error",
        errors: messages,
      });
    }

    if (error.statusCode === 429) {
      return reply.status(429).send({
        message: error.message,
      });
    }

    return reply.status(500).send({
      message: "Server error.",
    });
  });
};
