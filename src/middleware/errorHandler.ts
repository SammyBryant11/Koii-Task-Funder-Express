import { Request, Response, NextFunction } from 'express';

// Custom error class for application-specific errors
export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handling middleware
export const globalErrorHandler = (
  err: AppError | Error, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Handle operational errors (predicted errors)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Handle unexpected/programming errors
  console.error('UNHANDLED ERROR 💥', err);

  // Send generic error response for unexpected errors
  res.status(500).json({
    status: 'error',
    message: 'Something went very wrong!'
  });
};

// Function to handle async route handlers and catch errors
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};