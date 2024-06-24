import { Request, Response, NextFunction } from 'express';
declare const localizationMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export default localizationMiddleware;
