export class AccountResponse {
  userId: string;
  username: string;
  status: string;
  createAt: string;

  constructor(
    userId: string,
    username: string,
    status: string,
    createAt: string,
  ) {
    this.userId = userId;
    this.username = username;
    this.status = status;
    this.createAt = createAt;
  }
}
