import { Request, Response } from 'express';
export declare const deleteDevice: (req: Request, res: Response) => Promise<void>;
export declare const updateDevice: (req: Request, res: Response) => Promise<void>;
export declare const getDevicesByUser: (req: Request, res: Response) => Promise<void>;
export declare const getUserDeviceById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
