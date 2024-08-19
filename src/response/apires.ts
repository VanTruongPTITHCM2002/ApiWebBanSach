export interface ApiResponse<D> {
  statusCode: number;
  message: string;
  data: D;
}
