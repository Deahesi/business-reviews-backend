import { HttpException, HttpStatus } from '@nestjs/common';


export class CompanyNotfoundException extends HttpException {
  messages

  constructor(response) {
    super(response, HttpStatus.NOT_FOUND);
    this.messages = response
  }
}
