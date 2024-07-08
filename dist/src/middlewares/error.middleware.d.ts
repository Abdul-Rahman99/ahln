import { NextFunction, Request, Response } from 'express';
export declare const errorMiddleware: (err: Error & {
    status?: number;
    code?: number;
    keyValue?: Record<string, any>;
}, req: Request, res: Response, next: NextFunction) => void;
