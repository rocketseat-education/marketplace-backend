import { AppError } from './app.error';

export class StorageError extends AppError {
  constructor(message: string, previousError?: Error) {
    super(message, 500, previousError);
  }
}
