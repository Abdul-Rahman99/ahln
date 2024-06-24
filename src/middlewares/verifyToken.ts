import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import i18n from '../config/i18n';
import config from '../../config';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Assuming Bearer token
  if (!token) {
    return res.status(401).json({ message: i18n.__('TOKEN_REQUIRED') });
  }

  try {
    if (!config.JWT_SECRET_KEY) {
      throw new Error('JWT secret key is not defined.');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET_KEY) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (
      err instanceof jwt.JsonWebTokenError ||
      err instanceof jwt.TokenExpiredError
    ) {
      return res.status(401).json({ message: i18n.__('INVALID_TOKEN') });
    }
    return res.status(500).json({ message: i18n.__('SERVER_ERROR') });
  }
};

export default verifyToken;
