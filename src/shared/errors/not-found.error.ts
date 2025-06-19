import { AppError } from './app.error';

export class NotFoundError extends AppError {
  constructor(
    message: string,
    previousError?: Error,
    shouldPrintInConsole = true,
  ) {
    super(message, 404, previousError);
    this.shouldPrintInConsole = shouldPrintInConsole;
  }
}
