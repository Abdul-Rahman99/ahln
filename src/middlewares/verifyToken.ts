import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import i18n from '../config/i18n';
import config from '../../config';
import ResponseHandler from '../utils/responsesHandler';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('authorization')?.split(' ')[1]; // Assuming Bearer token
  if (!token) {
    return ResponseHandler.badRequest(res, i18n.__('TOKEN_REQUIRED'));
  }

  try {
    if (!config.JWT_SECRET_KEY) {
      return ResponseHandler.unauthorized(res, i18n.__('JWT_UNDEFINED'));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET_KEY) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError
    ) {
      return ResponseHandler.unauthorized(res, i18n.__('INVALID_TOKEN'));
    }
    return ResponseHandler.internalError(res, i18n.__('SERVER_ERROR'));
  }
};

export default verifyToken;
