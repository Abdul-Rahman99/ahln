import { NextFunction, Response, Request } from 'express';
import UserModel from '../models/users/user.model';
import ResponseHandler from './responsesHandler';

const userModel = new UserModel();

const authHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<string> => {
  try {
    // Extract token from the request headers
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
    } else {
      const user = await userModel.findByToken(token);
      if (!user) {
        ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
      } else {
        return user;
      }
    }
    return '';
    // Find the user by the token
  } catch (error) {
    next();
    throw new Error((error as Error).message);
  }
};
export default authHandler;
