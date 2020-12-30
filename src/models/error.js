import ExtendableError from "es6-error";

export class BaseError extends ExtendableError {}

export class UnauthorizedError extends BaseError {}

export class UserLocationError extends BaseError {
  constructor(e) {
    super(e);

    this.userMessage = e.userMessage;
  }
}
