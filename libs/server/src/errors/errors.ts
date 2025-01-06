import httpStatus from "http-status"

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational: boolean = true) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Exclude this constructor from the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, httpStatus.NOT_FOUND);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Invalid input') {
    super(message, httpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, httpStatus.UNAUTHORIZED);
  }
}
