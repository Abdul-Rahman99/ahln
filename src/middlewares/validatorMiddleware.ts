import { Request, Response, NextFunction } from 'express';
import { validationResult, Result, ValidationError } from 'express-validator';
import ResponseHandler from '../utils/responsesHandler';
import i18n from '../config/i18n';

const validatorMiddleware = (
  req: Request,
  res: Response<unknown, Record<string, unknown>>,
  next: NextFunction,
): void => {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.type,
      message: error.msg,
    }));
    ResponseHandler.badRequest(
      res,
      i18n.__('VALIDATION_ERROR'),
      formattedErrors,
    );
    return;
  }
  next();
};

export default validatorMiddleware;
