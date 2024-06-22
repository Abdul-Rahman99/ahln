import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import i18n from '../config/i18n';
import config from '../../config';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Assuming Bearer token
  if (!token) {
    return res.status(401).json({ message: i18n.__('TOKEN_REQUIRED') });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: i18n.__('INVALID_TOKEN') });
  }
};

export default verifyToken;
