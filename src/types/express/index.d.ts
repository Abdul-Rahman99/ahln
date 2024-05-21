import { Request, Express } from 'express';
import { iUser } from '../IUser';
import { File } from 'multer';

declare global {
  namespace Express {
    interface Request extends Request {
      currentUser?: iUser;
      user?: Record<string, any>;
      file?: File;
      filterObj: {};
    }
  }
}
