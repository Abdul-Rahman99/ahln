import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import i18n from '../config/i18n';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'] as string | undefined;

  if (!authHeader) {
    res.status(401).json({ message: i18n.__('TOKEN_REQUIRED') });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const currentUser = jwt.verify(token, config.JWT_SECRET_KEY!) as {
      id: string;
      role: string;
    };
    req.currentUser = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ message: i18n.__('INVALID_TOKEN') });
  }
};

export default verifyToken;
