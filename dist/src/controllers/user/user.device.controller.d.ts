import { Request, Response, NextFunction } from 'express';
export declare const registerDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateDevice: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDevicesByUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserDeviceById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
