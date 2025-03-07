import { ResponseService } from './response.service';

export class BaseController {
  constructor(private responseService: ResponseService) {}

  success<T>(data: T, message = 'Thành công', statusCode = 200) {
    return this.responseService.success(data, message, statusCode);
  }
  error(message = 'Thất bại', statusCode = 500, error: string | object) {
    return this.responseService.error(message, statusCode, error);
  }
}
