import { Request, Response } from 'express';
export declare const assignPermissionToRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const removePermissionFromRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getPermissionsByRole: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
