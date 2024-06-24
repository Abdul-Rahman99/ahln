import { Request, Response } from 'express';
export declare const assignPermissionToUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removePermissionFromUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPermissionsByUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
