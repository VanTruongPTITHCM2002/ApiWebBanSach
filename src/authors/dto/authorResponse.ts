export class AuthorResponse {
  fullname: string;

  constructor(firstname: string, lastname: string) {
    this.fullname = firstname + ' ' + lastname;
  }
}
