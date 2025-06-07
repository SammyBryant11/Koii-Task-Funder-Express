import { describe, it, expect, vi } from 'vitest';
import { AppError, globalErrorHandler, catchAsync } from '../src/middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('Error Handling Middleware', () => {
  describe('AppError', () => {
    it('should create an error with correct properties', () => {
      const error = new AppError('Test error', 404);
      
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(404);
      expect(error.status).toBe('fail');
      expect(error.isOperational).toBe(true);
    });
  });

  describe('globalErrorHandler', () => {
    it('should handle AppError correctly', () => {
      const mockReq = {} as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;

      const appError = new AppError('Test operational error', 400);
      globalErrorHandler(appError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Test operational error'
      });
    });

    it('should handle unexpected errors', () => {
      const mockReq = {} as Request;
      const mockRes = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn()
      } as unknown as Response;
      const mockNext = vi.fn() as NextFunction;
      const unexpectedError = new Error('Unexpected error');

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      globalErrorHandler(unexpectedError, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Something went very wrong!'
      });
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('catchAsync', () => {
    it('should catch and pass async errors to next middleware', async () => {
      const mockNext = vi.fn();
      const mockReq = {} as Request;
      const mockRes = {} as Response;
      const mockError = new Error('Async error');

      const asyncHandler = catchAsync(async () => {
        throw mockError;
      });

      await asyncHandler(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(mockError);
    });
  });
});