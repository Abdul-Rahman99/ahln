import i18n from '../config/i18n';
import { Request, Response, NextFunction } from 'express';

const localizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const lang = req.headers['accept-language'] || 'en';
  if (lang) {
    i18n.setLocale(lang);
  }
  next();
};

export default localizationMiddleware;
