export class AccountResponse {
  username: string;
  status: string;
  createAt: string;

  constructor(username: string, status: string, createAt: string) {
    this.username = username;
    this.status = status;
    this.createAt = createAt;
  }
}
