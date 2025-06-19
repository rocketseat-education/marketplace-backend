export class AppError extends Error {
  protected statusCode: number;
  protected previousError: Error | null;
  protected shouldPrintInConsole: boolean;

  constructor(message: string, statusCode: number, previousError?: Error) {
    super(message);
    this.statusCode = statusCode;
    this.previousError = previousError ?? null;
    this.shouldPrintInConsole = true;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public getPrevious() {
    return this.previousError;
  }

  public getShouldPrintInConsole() {
    return this.shouldPrintInConsole;
  }
}
