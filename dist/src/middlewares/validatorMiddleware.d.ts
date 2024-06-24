import { Request, Response, NextFunction } from 'express';
declare const validatorMiddleware: (req: Request, res: Response<unknown, Record<string, unknown>>, next: NextFunction) => void;
export default validatorMiddleware;
