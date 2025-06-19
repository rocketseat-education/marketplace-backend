import { AppError } from './app.error';

export class UnauthenticatedError extends AppError {
  constructor(message: string = 'Unauthorized.') {
    super(message, 401);
    this.shouldPrintInConsole = false;
  }
}
