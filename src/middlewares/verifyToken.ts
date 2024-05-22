import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../../config';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader: any =
    req.headers['Authorization'] || req.headers['authorization'];
  if (!authHeader) {
    res.status(401);
    return next(new Error('Token is required'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const currentUser: any = jwt.verify(token, config.JWT_SECRET_KEY!);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    res.status(401);
    next(new Error('Invalid Token'));
  }
};

export default verifyToken;
