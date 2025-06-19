import { AppError } from './app.error';

export class ForbiddenError extends AppError {
  constructor(message: string = 'Unauthorized.') {
    super(message, 403);
  }
}
