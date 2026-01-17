export class ApiRes<T> {
  constructor(
    public success?: boolean,
    public statusCode?: number,
    public message?: string,
    public data?: T,
    public error?: string | object,
  ) {}

  static success<T>(message: string, data?: T): ApiRes<T> {
    return new ApiRes<T>(true, 200, message, data, null);
  }

  static error<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(false, 400, message, undefined, error);
  }

  static unauthorized<T>(
    message: string,
    error: string = 'Thất bại',
  ): ApiRes<T> {
    return new ApiRes<T>(false, 401, message, undefined, error);
  }

  static forbidden<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(false, 403, message, undefined, error);
  }

  static notFound<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(false, 404, message, undefined, error);
  }

  static conflict<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(false, 409, message, undefined, error);
  }

  static internalServerError<T>(
    message: string,
    error: string = 'Thất bại',
  ): ApiRes<T> {
    return new ApiRes<T>(false, 500, message, undefined, error);
  }

  static badRequest<T>(message: string, error: string = 'Thất bại'): ApiRes<T> {
    return new ApiRes<T>(false, 400, message, undefined, error);
  }

  static created<T>(message: string, data?: T): ApiRes<T> {
    return new ApiRes<T>(true, 201, message, data);
  }
}
