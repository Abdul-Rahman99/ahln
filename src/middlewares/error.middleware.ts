/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { config } from '../../config';
import  Error  from '../types/error.type';

const nodeEnv = config.NODE_ENV;

export const errorMiddleware = (
  err: Error & {
    status?: number;
    code?: number;
    keyValue?: Record<string, any>;
  },
  req: Request,
  res: Response,
) => {
  const customError = {
    statusCode: res.statusCode || 500,
    message: err.message || 'Internal Server Error',
  };

  if (err.name === 'CastError') {
    customError.statusCode = 403;
    customError.message = `Resource not found. Invalid: ${err.message}`;
  }

  if (err.code === 11000) {
    customError.statusCode = 403;
    customError.message = `Duplicate ${Object.keys(err.keyValue!)} Entered`;
  }

  if (err.name === 'TokenExpiredError') {
    customError.statusCode = 403;
    customError.message =
      'Unauthorized: You are not allowed to access this resource';
  }

  res.status(customError.statusCode).json({
    success: false,
    status: customError.statusCode,
    message: customError.message,
    stack: nodeEnv === 'development' ? err.stack : null,
  });
};

export const handleErrorResponse = (error: any, res: Response) => {
  res.status(500);
  throw new Error(nodeEnv === 'development' ? error : 'something went wrong');
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
