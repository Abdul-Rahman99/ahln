/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UserModel from '../models/users/user.model';
import ResponseHandler from '../utils/responsesHandler';
import i18n from '../config/i18n';

const userModel = new UserModel();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    const user = await userModel.getOne(decoded.id);

    if (!user) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
    }

    req.user = user;
    next();
  } catch (error: any) {
    ResponseHandler.internalError(
      res,
      i18n.__('AUTHENTICATION_FAILED'),
      error.message,
    );
  }
};
