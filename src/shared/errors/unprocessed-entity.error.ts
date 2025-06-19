import { AppError } from './app.error';

export class UnprocessedEntityError extends AppError {
  private errors: string[];

  constructor(errors: string[]) {
    super('Validation error', 422);
    this.errors = errors || [];
  }

  getErrors() {
    return this.errors;
  }
}
