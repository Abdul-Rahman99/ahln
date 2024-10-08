import { Response, Request } from 'express';
import UserModel from '../models/users/user.model';
import ResponseHandler from './responsesHandler';
import i18n from '../config/i18n';

const userModel = new UserModel();

const authHandler = async (req: Request, res: Response): Promise<string> => {
  try {
    // Extract token from the request headers
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return 'Ahln_24_U00000010';
      // ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
    } else {
      const user = await userModel.findByToken(token);
      if (!user) {
        ResponseHandler.unauthorized(res, i18n.__('INVALID_TOKEN'));
        return '0';
      } else {
        return user;
      }
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
export default authHandler;
