export interface ApiResponse<D> {
  statusCode: number;
  message: string;
  data?: D;
  error: string | object;
}
