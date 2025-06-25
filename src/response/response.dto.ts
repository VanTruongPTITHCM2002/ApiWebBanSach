export class ApiRes<T> {
  constructor(
    public statusCode: number,
    public message: string,
    public data?: T,
    public error?: string | object,
  ) {}

  static success<T>(message: string, data?: T): ApiRes<T> {
    return new ApiRes<T>(200, message, data);
  }

  static error<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(400, message, undefined, error);
  }

  static unauthorized<T>(
    message: string,
    error: string = 'Thất bại',
  ): ApiRes<T> {
    return new ApiRes<T>(401, message, undefined, error);
  }

  static forbidden<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(403, message, undefined, error);
  }

  static notFound<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(404, message, undefined, error);
  }

  static conflict<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(409, message, undefined, error);
  }

  static internalServerError<T>(
    message: string,
    error: string = 'Thất bại',
  ): ApiRes<T> {
    return new ApiRes<T>(500, message, undefined, error);
  }

  static badRequest<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(400, message, undefined, error);
  }

  static created<T>(message: string, data?: T): ApiRes<T> {
    return new ApiRes<T>(201, message, data);
  }
}
