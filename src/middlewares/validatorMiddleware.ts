import { Request, Response, NextFunction } from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';

const validatorMiddleware = (
  req: Request,
  res: Response<unknown, Record<string, unknown>>,
  next: NextFunction,
): void => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  } else {
    next();
  }
};

export default validatorMiddleware;
